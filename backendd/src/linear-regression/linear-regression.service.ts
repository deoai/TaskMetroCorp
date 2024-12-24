import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { OccupancyPricing, PredictionResult } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalData } from '../entities/historical-data.entity';
import { PredictedData } from '../entities/predicted-data.entity';
import { CreatePredictedDataDto } from './dto/create-predicted-data.dto';


@Injectable()
export class LinearRegressionService implements OnModuleInit {
  private model: tf.Sequential;
  private maxOccupancy: number = 0; // Untuk normalisasi
  private maxPricing: number = 0;  // Untuk normalisasi
  
  constructor(
    @InjectRepository(PredictedData)
    private predictedDataRepository: Repository<PredictedData>,
    @InjectRepository(HistoricalData) // Tambahan baru
    private historicalDataRepository: Repository<HistoricalData>,
  ) {
    
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 1, inputShape: [1] })); // 1 input (occupancy) dan 1 output (pricing)
    this.model.compile({
        optimizer: tf.train.sgd(0.01),
        loss: 'meanSquaredError',
      });
    
  }

  async onModuleInit(): Promise<void> {
    console.log('Initializing LinearRegressionService...');
    const filePath = './data/dataset.csv'; // Path ke file dataset
    try {
      await this.trainModelFromFile(filePath); // Melatih model dari file CSV
      console.log('Model trained successfully during startup.');
    } catch (error) {
      console.error('Failed to train model during startup:', error.message);
    }
  }

  async storePredicted(createPredictedDataDto: CreatePredictedDataDto): Promise<void> {
    const { occupancy, price } = createPredictedDataDto;

    // Simpan data ke database
    await this.predictedDataRepository.save({
      occupancy,
      predicted_price: price,
    });

    // Simpan ke tabel HistoricalData
    try {
      await this.historicalDataRepository.save({
        occupancy,
        price, // Harga yang sama dengan `predicted_price`
      });
      // console.log(`Data saved to HistoricalData: occupancy=${occupancy}, price=${price}`);
    } catch (error) {
      if (error.code === '23505') { // Constraint UNIQUE
        // console.warn(`Data with occupancy=${occupancy} and price=${price} already exists in HistoricalData.`);
      } else {
        console.error('Error saving data to HistoricalData:', error.message);
      }
    }
  }

  async trainModelFromFile(filePath: string): Promise<void> {
    const data = await this.loadCSV(filePath);
    // Hitung nilai maksimum untuk normalisasi
    this.maxOccupancy = Math.max(...data.map(d => d.occupancy));
    this.maxPricing = Math.max(...data.map(d => d.pricing));

    //Cek data unique
    const uniqueData = data.filter((value, index, self) =>
      index === self.findIndex((t) => t.occupancy === value.occupancy && t.pricing === value.pricing),
    );
    
    // console.log('Filtered Unique Data:', uniqueData);
    
     // Simpan data historis ke database
    try {
      await this.historicalDataRepository.save(
        uniqueData.map((row) => ({
          occupancy: row.occupancy,
          price: row.pricing,
        })),
      );
      // console.log('Historical data saved successfully');
    } catch (error) {
      console.log('Some data were not inserted due to unique constraint:', error.message);
    }

    // Normalisasi data
    const normalizedData = data.map(d => ({
      occupancy: d.occupancy / this.maxOccupancy,
      pricing: d.pricing / this.maxPricing,
    }));

    const X = tf.tensor2d(normalizedData.map(d => [d.occupancy]));
    const y = tf.tensor2d(normalizedData.map(d => [d.pricing]));

    // console.log('Normalized X Tensor:', X.arraySync());
    // console.log('Normalized y Tensor:', y.arraySync());

    // Melatih model
    await this.model.fit(X, y, {
      epochs: 200,
      verbose: 1,
    });

    console.log('Model trained successfully');

    const predictions = this.model.predict(X) as tf.Tensor;
    const predictedValues = predictions.arraySync() as number[][];
    // console.log('Training Data Predicted vs Actual:', {
    //     actual: y.arraySync(),
    //     predicted: predictedValues,
    // });
  }

  predict(occupancyValues: number[]): PredictionResult[] {
    // Normalisasi input
    const inputTensor = tf.tensor2d(occupancyValues.map(v => [v / this.maxOccupancy]));
    const predictions = this.model.predict(inputTensor) as tf.Tensor;
  
    // Denormalisasi
    const predictedValues = predictions.arraySync() as number[][];
    console.log('Predicted Values (Normalized):', predictedValues);
  
    return occupancyValues.map((occupancy, i) => ({
      occupancy,
      predictedPricing: Math.round(predictedValues[i][0] * this.maxPricing / 1000) * 1000, // Denormalisasi Rounding
    }));
  }

  private loadCSV(filePath: string): Promise<OccupancyPricing[]> {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(filePath);
      const data: OccupancyPricing[] = [];
      Papa.parse(fileStream, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          result.data.forEach((row: any) => {
            const occupancy = parseFloat(row['occupancy']);
            const pricing = parseFloat(row['price']);
            if (!isNaN(occupancy) && !isNaN(pricing)) {
              data.push({ occupancy, pricing });
            }
          });
          resolve(data);
        },
        error: (error) => reject(error),
      });
    });
  }
}
