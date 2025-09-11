import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DriverStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  vehicleNumber?: string;

  @Column({ nullable: true })
  vehicleType?: string;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.OFFLINE
  })
  status: DriverStatus;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude?: number;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ default: 0 })
  totalDeliveries: number;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 