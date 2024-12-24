import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PricePredictionService {
  private model: tf.Sequential;
  private modelPath = path.resolve(__dirname, '../../model', 'linear-model.json');
  private dataPath = path.resolve(__dirname, '../../data', 'dataset.csv');

  constructor() {
    this.loadModel();
  }

  // Membaca dataset dari file CSV
  async loadDataset(): Promise<{ occupancy: number[]; prices: number[] }> {
    const occupancy: number[] = [];
    const prices: number[] = [];

    const data = fs.readFileSync(this.dataPath, 'utf-8');
    const rows = data.split('\n');
    for (const row of rows.slice(1)) {
      if (row.trim()) {
        const [occupancyValue, priceValue] = row.split(',').map((val) => Number(val));
        console.log(`Occupancy: ${occupancyValue}, Price: ${priceValue}`);
        occupancy.push(occupancyValue);
        prices.push(priceValue);
      }
    }

    return { occupancy, prices };
  }

  // Melatih model menggunakan dataset CSV
  async trainModelFromCSV() {
    const { occupancy, prices } = await this.loadDataset();

    const xs = tf.tensor2d(occupancy, [occupancy.length, 1]);
    const ys = tf.tensor2d(prices, [prices.length, 1]);

    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    this.model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    console.log('Training the model...');
    await this.model.fit(xs, ys, { epochs: 100 });

    console.log('Training completed. Saving the model...');
    await this.model.save(tf.io.withSaveHandler(async (artifacts) => {
      fs.writeFileSync(this.modelPath, JSON.stringify(artifacts));
      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: 'JSON',
        },
        responses: [],
      };
    }));
  }

  // Memuat model dari file
  async loadModel() {
    if (fs.existsSync(this.modelPath)) {
      console.log('Loading existing model...');
      const modelArtifacts = JSON.parse(fs.readFileSync(this.modelPath, 'utf-8'));
      this.model = tf.sequential();
      const loadedModel = await tf.loadLayersModel(tf.io.fromMemory(modelArtifacts.modelTopology, modelArtifacts.weightData));
      this.model.add(loadedModel.layers[0]);
      console.log('Model loaded successfully!');
      console.log('Model weights:', this.model.getWeights().map(w => w.arraySync()));
    } else {
      console.log('No model found. Please train the model first.');
    }
  }

  // Melakukan prediksi
  async predict(occupancy: number): Promise<number> {
    console.log(`Input occupancy: ${occupancy}`);
    
    if (!this.model) {
      throw new Error('Model not loaded. Please train the model first.');
    }
  
    const inputTensor = tf.tensor2d([occupancy], [1, 1]);
    console.log('Input Tensor:', inputTensor.arraySync());
  
    const outputTensor = this.model.predict(inputTensor) as tf.Tensor;
    const output = await outputTensor.data();
    console.log(`Output Tensor: ${outputTensor.arraySync()}`);
    
    return output[0];
  }
  
}
