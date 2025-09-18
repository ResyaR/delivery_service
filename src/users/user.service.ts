import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async create(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(id: number, dto: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, dto);
    return this.findById(id);
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { refreshToken } });
  }

  async isUserLoggedOut(userId: number): Promise<boolean> {
    const user = await this.findById(userId);
    return !user || !user.refreshToken || user.refreshToken === '';
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    await this.userRepository.remove(user);
  }
}
