import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Delivery } from './delivery.entity';

@Entity('multi_drop_locations')
export class MultiDropLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deliveryId: number;

  @ManyToOne(() => Delivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deliveryId' })
  delivery: Delivery;

  @Column()
  sequence: number; // Urutan drop (1, 2, 3...)

  @Column()
  locationName: string; // Nama tempat

  @Column()
  address: string; // Alamat lengkap

  @Column({ nullable: true })
  recipientName?: string;

  @Column({ nullable: true })
  recipientPhone?: string;

  @Column({ nullable: true })
  notes?: string; // Catatan khusus

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'timestamp', nullable: true })
  arrivedAt?: Date; // Waktu sampai

  @Column({ default: false })
  isCompleted: boolean; // Sudah deliver atau belum
}

