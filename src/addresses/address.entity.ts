import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  label: string; // e.g., "Rumah", "Kantor", "Kos"

  @Column({ nullable: true })
  recipientName: string; // Nama penerima

  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  cityId: number;

  @Column()
  province: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  zone: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ default: false })
  isDefault: boolean; // Default address untuk user

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

