import { Module } from '@nestjs/common';
import { LinearRegressionModule } from './linear-regression/linear-regression.module';

@Module({
  imports: [LinearRegressionModule],
})
export class AppModule {}
