import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingManager } from './shipping-manager.entity';
import { CreateShippingManagerDto } from './dto/create-shipping-manager.dto';
import { UpdateShippingManagerDto } from './dto/update-shipping-manager.dto';
import * as crypto from 'crypto';

@Injectable()
export class ShippingManagerService {
  constructor(
    @InjectRepository(ShippingManager)
    private shippingManagerRepository: Repository<ShippingManager>,
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

    const shippingManager = this.shippingManagerRepository.create({
      ...createDto,
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

    Object.assign(shippingManager, updateDto);
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

