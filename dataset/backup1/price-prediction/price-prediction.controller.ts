import { Controller, Post, Get, Query } from '@nestjs/common';
import { PricePredictionService } from './price-prediction.service';

@Controller('price-prediction')
export class PricePredictionController {
  constructor(private readonly predictionService: PricePredictionService) {}

  // Endpoint untuk melatih model dari dataset CSV
  @Post('train-from-csv')
  async trainFromCSV() {
    await this.predictionService.trainModelFromCSV();
    return { message: 'Model trained from CSV and saved successfully.' };
  }

  // Endpoint untuk prediksi harga
  @Get('predict')
  async predict(@Query('occupancy') occupancy: number) {
    const price = await this.predictionService.predict(Number(occupancy));
    return { occupancy, predictedPrice: price };
  }
}
