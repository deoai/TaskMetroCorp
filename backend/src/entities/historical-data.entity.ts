import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['occupancy', 'price']) // Tambahkan constraint unik
export class HistoricalData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  occupancy: number;

  @Column()
  price: number;
}