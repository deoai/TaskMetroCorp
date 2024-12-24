import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { LinearRegressionService } from './linear-regression.service';
import { PredictionResult } from './types';
import { CreatePredictedDataDto } from './dto/create-predicted-data.dto';

@Controller('linear-regression')
export class LinearRegressionController {
  constructor(private readonly regressionService: LinearRegressionService) {}

  @Post('train-from-file')
  async trainModelFromFile(): Promise<string> {
    const filePath = './data/dataset.csv'; // Path ke dataset baru
    await this.regressionService.trainModelFromFile(filePath);
    return 'Model trained successfully from file';
  }

  @Get('predict')
  predictPricing(@Query('occupancyValues') occupancyValues: string): PredictionResult[] {
    const values = occupancyValues.split(',').map(Number);
    return this.regressionService.predict(values);
  }
  // Endpoint baru untuk menyimpan prediksi
  @Post('store-predict')
  async storePredictedData(@Body() createPredictedDataDto: CreatePredictedDataDto): Promise<string> {
    await this.regressionService.storePredicted(createPredictedDataDto);
    return 'Predicted data stored successfully';
  }
}
