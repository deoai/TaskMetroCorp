import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { OccupancyPricing, PredictionResult } from './types';

@Injectable()
export class LinearRegressionService {
  private model: tf.Sequential;
  private maxOccupancy: number = 0; // Untuk normalisasi
  private maxPricing: number = 0;  // Untuk normalisasi

  constructor() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 1, inputShape: [1] })); // 1 input (occupancy) dan 1 output (pricing)
    this.model.compile({
        optimizer: tf.train.adam(0.01), // Optimizer Adam untuk stabilitas
        loss: 'meanSquaredError',
      });      
  }

  async trainModelFromFile(filePath: string): Promise<void> {
    const data = await this.loadCSV(filePath);

    // Hitung nilai maksimum untuk normalisasi
    this.maxOccupancy = Math.max(...data.map(d => d.occupancy));
    this.maxPricing = Math.max(...data.map(d => d.pricing));

    // Normalisasi data
    const normalizedData = data.map(d => ({
      occupancy: d.occupancy / this.maxOccupancy,
      pricing: d.pricing / this.maxPricing,
    }));

    const X = tf.tensor2d(normalizedData.map(d => [d.occupancy]));
    const y = tf.tensor2d(normalizedData.map(d => [d.pricing]));

    console.log('Normalized X Tensor:', X.arraySync());
    console.log('Normalized y Tensor:', y.arraySync());

    // Melatih model
    await this.model.fit(X, y, {
      epochs: 50,
      verbose: 1,
    });

    console.log('Model trained successfully');

    const predictions = this.model.predict(X) as tf.Tensor;
    const predictedValues = predictions.arraySync() as number[][];
    console.log('Training Data Predicted vs Actual:', {
        actual: y.arraySync(),
        predicted: predictedValues,
    });

  }

  predict(occupancyValues: number[]): PredictionResult[] {
    // Normalisasi input
    const inputTensor = tf.tensor2d(occupancyValues.map(v => [v / this.maxOccupancy]));
    const predictions = this.model.predict(inputTensor) as tf.Tensor;
    

    // Denormalisasi output
    const predictedValues = predictions.arraySync() as number[][];
    console.log('Predicted Values (Normalized):', predictedValues);

    return occupancyValues.map((occupancy, i) => ({
        occupancy,
        predictedPricing: predictedValues[i][0] * this.maxPricing, // Denormalisasi
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
