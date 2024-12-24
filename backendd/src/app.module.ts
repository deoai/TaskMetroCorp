import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinearRegressionModule } from './linear-regression/linear-regression.module';
import { PredictedData } from './entities/predicted-data.entity';
import { HistoricalData } from './entities/historical-data.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'db',
      entities: [PredictedData, HistoricalData],
      synchronize: true,
    }),
    LinearRegressionModule,
  ],
})
export class AppModule {}
