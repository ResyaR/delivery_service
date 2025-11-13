import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderItem } from './order-item.entity';
import { ShippingManager } from '../shipping-managers/shipping-manager.entity';

export enum DeliveryType {
  REGULAR = 'regular',
  EXPRESS = 'express',
  SCHEDULED = 'scheduled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  restaurantId: number;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text' })
  deliveryAddress: string;

  @Column({ type: 'text', nullable: true })
  deliveryCity: string;

  @Column({ type: 'text', nullable: true })
  deliveryProvince: string;

  @Column({ type: 'text', nullable: true })
  deliveryPostalCode: string;

  @Column({ type: 'int', nullable: true })
  deliveryZone: number; // 1-5

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.REGULAR,
  })
  deliveryType: DeliveryType;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date;

  @Column({ type: 'time', nullable: true })
  scheduledTime: string;

  @Column({ nullable: true })
  scheduleTimeSlot: string; // "09:00-12:00", "13:00-17:00", etc

  @Column({ nullable: true })
  shippingManagerId: number;

  @ManyToOne(() => ShippingManager, { nullable: true })
  @JoinColumn({ name: 'shippingManagerId' })
  shippingManager: ShippingManager;

  @Column({ default: 'pending' })
  status: string; // pending, preparing, delivering, delivered, cancelled

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerPhone: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

