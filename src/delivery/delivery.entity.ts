import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { DeliveryType } from './dto/delivery-type.enum';

export enum DeliveryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  pickupLocation: string;

  @Column()
  dropoffLocation: string;

  @Column('json', { nullable: true })
  barang?: {
    itemName: string;
    scale: string;
  };

  @Column({ nullable: true })
  titipDeskripsi?: string;

  @Column({ type: 'timestamp', nullable: true })
  jadwal?: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: DeliveryType
  })
  type: DeliveryType;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING
  })
  status: DeliveryStatus;

  @Column({ nullable: true })
  driverId?: number;

  @Column({ nullable: true })
  estimatedArrival?: Date;

  @Column({ nullable: true })
  actualArrival?: Date;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 