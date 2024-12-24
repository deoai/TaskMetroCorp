import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class PredictedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  occupancy: number;

  @Column()
  predicted_price: number;

  @CreateDateColumn()
  timestamp: Date;
}