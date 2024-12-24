import { Controller, Post, Get, Query } from '@nestjs/common';
import { LinearRegressionService } from './linear-regression.service';
import { PredictionResult } from './types';

@Controller('linear-regression')
export class LinearRegressionController {
  constructor(private readonly regressionService: LinearRegressionService) {}

  @Post('train-from-file')
  async trainModelFromFile(): Promise<string> {
    const filePath = './data/occupancy_price.csv'; // Path ke dataset baru
    await this.regressionService.trainModelFromFile(filePath);
    return 'Model trained successfully from file';
  }

  @Get('predict')
  predictPricing(@Query('occupancyValues') occupancyValues: string): PredictionResult[] {
    const values = occupancyValues.split(',').map(Number);
    return this.regressionService.predict(values);
  }
}
