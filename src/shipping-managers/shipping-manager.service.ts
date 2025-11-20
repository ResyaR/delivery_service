import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingManager } from './shipping-manager.entity';
import { CreateShippingManagerDto } from './dto/create-shipping-manager.dto';
import { CreateShippingManagerWithUserDto } from './dto/create-shipping-manager-with-user.dto';
import { UpdateShippingManagerDto } from './dto/update-shipping-manager.dto';
import { UserService } from '../users/user.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ShippingManagerService {
  constructor(
    @InjectRepository(ShippingManager)
    private shippingManagerRepository: Repository<ShippingManager>,
    private userService: UserService,
  ) {}

  /**
   * Generate unique token for shipping manager
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async create(createDto: CreateShippingManagerDto): Promise<ShippingManager> {
    // Check if email already exists
    const existingEmail = await this.shippingManagerRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Use custom token if provided, otherwise generate unique token
    let token: string;
    if (createDto.token && createDto.token.trim()) {
      // Check if custom token already exists
      const existingToken = await this.shippingManagerRepository.findOne({
        where: { token: createDto.token.trim() },
      });
      if (existingToken) {
        throw new ConflictException('Token already exists. Please use a different token.');
      }
      token = createDto.token.trim();
    } else {
      // Generate unique token
      token = this.generateToken();
      let existingToken = await this.shippingManagerRepository.findOne({
        where: { token },
      });
      
      // Ensure token is unique
      while (existingToken) {
        token = this.generateToken();
        existingToken = await this.shippingManagerRepository.findOne({
          where: { token },
        });
      }
    }

    const shippingManager = this.shippingManagerRepository.create({
      name: createDto.name,
      email: createDto.email,
      phone: createDto.phone,
      zone: createDto.zone,
      token,
    });

    return await this.shippingManagerRepository.save(shippingManager);
  }

  async createWithUser(createDto: CreateShippingManagerWithUserDto): Promise<ShippingManager> {
    // Check if email already exists in shipping managers
    const existingEmail = await this.shippingManagerRepository.findOne({
      where: { email: createDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists in shipping managers');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    // Create user account (using email as username)
    try {
      await this.userService.create(
        createDto.email,
        createDto.email, // Use email as username
        hashedPassword
      );
    } catch (error) {
      throw new ConflictException('Email already exists in users');
    }

    // Generate unique token
    let token = this.generateToken();
    let existingToken = await this.shippingManagerRepository.findOne({
      where: { token },
    });
    
    // Ensure token is unique
    while (existingToken) {
      token = this.generateToken();
      existingToken = await this.shippingManagerRepository.findOne({
        where: { token },
      });
    }

    // Create shipping manager
    const shippingManager = this.shippingManagerRepository.create({
      name: createDto.name,
      email: createDto.email,
      phone: createDto.phone,
      zone: createDto.zone,
      token,
    });

    return await this.shippingManagerRepository.save(shippingManager);
  }

  async findAll(): Promise<ShippingManager[]> {
    return await this.shippingManagerRepository.find({
      order: { zone: 'ASC', name: 'ASC' },
    });
  }

  async findByZone(zone: number): Promise<ShippingManager[]> {
    return await this.shippingManagerRepository.find({
      where: { zone, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ShippingManager> {
    const shippingManager = await this.shippingManagerRepository.findOne({
      where: { id },
    });

    if (!shippingManager) {
      throw new NotFoundException(`Shipping manager with ID ${id} not found`);
    }

    return shippingManager;
  }

  async findByToken(token: string): Promise<ShippingManager> {
    const shippingManager = await this.shippingManagerRepository.findOne({
      where: { token, isActive: true },
    });

    if (!shippingManager) {
      throw new NotFoundException('Invalid token');
    }

    return shippingManager;
  }

  async update(id: number, updateDto: UpdateShippingManagerDto): Promise<ShippingManager> {
    const shippingManager = await this.findOne(id);

    // Check if email is being updated and if it conflicts
    if (updateDto.email && updateDto.email !== shippingManager.email) {
      const existingEmail = await this.shippingManagerRepository.findOne({
        where: { email: updateDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if token is being updated and if it conflicts
    if (updateDto.token && updateDto.token.trim() && updateDto.token.trim() !== shippingManager.token) {
      const existingToken = await this.shippingManagerRepository.findOne({
        where: { token: updateDto.token.trim() },
      });
      if (existingToken) {
        throw new ConflictException('Token already exists. Please use a different token.');
      }
      shippingManager.token = updateDto.token.trim();
    }

    // Update other fields
    if (updateDto.name !== undefined) shippingManager.name = updateDto.name;
    if (updateDto.email !== undefined) shippingManager.email = updateDto.email;
    if (updateDto.phone !== undefined) shippingManager.phone = updateDto.phone;
    if (updateDto.zone !== undefined) shippingManager.zone = updateDto.zone;
    if (updateDto.isActive !== undefined) shippingManager.isActive = updateDto.isActive;

    return await this.shippingManagerRepository.save(shippingManager);
  }

  async regenerateToken(id: number): Promise<ShippingManager> {
    const shippingManager = await this.findOne(id);

    // Generate new unique token
    let token = this.generateToken();
    let existingToken = await this.shippingManagerRepository.findOne({
      where: { token },
    });
    
    while (existingToken) {
      token = this.generateToken();
      existingToken = await this.shippingManagerRepository.findOne({
        where: { token },
      });
    }

    shippingManager.token = token;
    return await this.shippingManagerRepository.save(shippingManager);
  }

  async remove(id: number): Promise<void> {
    const shippingManager = await this.findOne(id);
    await this.shippingManagerRepository.remove(shippingManager);
  }
}

