import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePredictedDataDto {
  @IsNumber()
  @IsNotEmpty()
  occupancy: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
