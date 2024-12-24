import { Module } from '@nestjs/common';
import { LinearRegressionService } from './linear-regression.service';
import { LinearRegressionController } from './linear-regression.controller';

@Module({
  controllers: [LinearRegressionController],
  providers: [LinearRegressionService],
})
export class LinearRegressionModule {}
