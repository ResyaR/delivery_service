import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { DeliveryType } from './dto/delivery-type.enum';
import { MultiDropLocation } from './multi-drop-location.entity';

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

  // Multi-drop relation
  @OneToMany(() => MultiDropLocation, (location) => location.delivery)
  multiDropLocations?: MultiDropLocation[];

  // Package details for PAKET_BESAR
  @Column('json', { nullable: true })
  packageDetails?: {
    weight: number;        // kg
    length: number;        // cm
    width: number;         // cm
    height: number;        // cm
    volumeWeight?: number; // kg (calculated)
    category?: string;     // Electronics, Furniture, etc
    isFragile?: boolean;
    requiresHelper?: boolean; // Perlu bantuan angkat
  };

  // Scheduled delivery details
  @Column({ type: 'date', nullable: true })
  scheduledDate?: Date; // Tanggal pengiriman

  @Column({ type: 'time', nullable: true })
  scheduledTime?: string; // Jam pengiriman (HH:MM)

  @Column({ nullable: true })
  scheduleTimeSlot?: string; // "09:00-12:00", "13:00-17:00", etc

  // Multi-drop specific
  @Column({ type: 'int', nullable: true })
  totalDropPoints?: number; // Jumlah drop points

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDistance?: number; // Total jarak (km)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 