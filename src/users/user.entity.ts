import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName?: string;


  @Column({ nullable: true })
  phone?: string;

  @Column({ 
    type: 'bytea',
    nullable: true 
  })
  avatar?: Buffer;

  @Column({ nullable: true })
  refreshToken?: string;
}
