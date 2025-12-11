import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PendingUser } from './entities/pending-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PendingUser)
    private pendingUserRepository: Repository<PendingUser>,
  ) {}


  async create(email: string, username: string, password: string): Promise<User> {
    const user = this.userRepository.create({ 
      email, 
      username, 
      password,
      isVerified: true // Set verified status when creating user after OTP verification
    });
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  private getWIBDate(): Date {
    const date = new Date();
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  }

  async updateLoginStatus(userId: number): Promise<void> {
    await this.userRepository.update(userId, { 
      lastLogin: this.getWIBDate()
    });
  }

  async updateLogoutStatus(userId: number): Promise<void> {
    await this.userRepository.update(userId, { 
      lastLogout: this.getWIBDate(),
      refreshToken: undefined 
    });
  }

  async updateRefreshTokenRequest(userId: number): Promise<void> {
    await this.userRepository.update(userId, { 
      lastRequestRefreshToken: new Date() 
    });
  }

  async updateProfile(id: number, dto: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, dto);
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'username', 'isAdmin', 'isVerified', 'fullName', 'phone', 'avatar', 'refreshToken']
    });
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

    // Use soft delete instead of hard delete
    await this.userRepository.softDelete(userId);
  }

  async updateVerificationStatus(userId: number, isVerified: boolean): Promise<void> {
    await this.userRepository.update(userId, { isVerified });
  }

  async deleteAllUsers(): Promise<void> {
    // Menggunakan query builder untuk menghapus data dengan cara yang aman
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Hapus semua delivery dari non-admin users
      await queryRunner.query(`
        DELETE FROM "delivery"
        WHERE "userId" IN (
          SELECT id FROM "user"
          WHERE "isAdmin" = false
        )
      `);

      // Hapus semua non-admin users
      await queryRunner.query(`
        DELETE FROM "user"
        WHERE "isAdmin" = false
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createPendingUser(email: string, username: string, password: string): Promise<PendingUser> {
    // Set expiry to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const pendingUser = this.pendingUserRepository.create({
      email,
      username,
      password,
      expiresAt
    });

    return this.pendingUserRepository.save(pendingUser);
  }

  async findPendingUser(email: string): Promise<PendingUser | null> {
    return this.pendingUserRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' }
    });
  }

  async deletePendingUser(email: string): Promise<void> {
    await this.pendingUserRepository.delete({ email });
  }
}
