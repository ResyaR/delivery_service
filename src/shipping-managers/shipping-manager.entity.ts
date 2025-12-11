import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Order } from '../orders/order.entity';

@Entity('shipping_managers')
export class ShippingManager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'int' })
  zone: number; // 1-5

  @Column({ unique: true })
  token: string; // Token untuk login shipping manager

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Order, order => order.shippingManager)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}

