import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinearRegressionService } from './linear-regression.service';
import { LinearRegressionController } from './linear-regression.controller';
import { HistoricalData } from '../entities/historical-data.entity';
import { PredictedData } from '../entities/predicted-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricalData, PredictedData])],
  controllers: [LinearRegressionController],
  providers: [LinearRegressionService],
})
export class LinearRegressionModule {}
