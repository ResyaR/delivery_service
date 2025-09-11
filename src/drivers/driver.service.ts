import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Driver, DriverStatus } from './driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    // Check if email already exists
    const existingDriver = await this.driverRepository.findOne({
      where: { email: createDriverDto.email }
    });

    if (existingDriver) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDriverDto.password, 10);

    const driver = this.driverRepository.create({
      ...createDriverDto,
      password: hashedPassword,
    });

    return await this.driverRepository.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    return await this.driverRepository.find({
      select: ['id', 'fullName', 'email', 'phone', 'status', 'currentLatitude', 'currentLongitude', 'rating', 'totalDeliveries']
    });
  }

  async findAvailableDrivers(): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { status: DriverStatus.AVAILABLE },
      select: ['id', 'fullName', 'phone', 'currentLatitude', 'currentLongitude', 'rating', 'vehicleType']
    });
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      select: ['id', 'fullName', 'email', 'phone', 'status', 'currentLatitude', 'currentLongitude', 'rating', 'totalDeliveries', 'vehicleNumber', 'vehicleType']
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async updateLocation(id: number, updateLocationDto: UpdateLocationDto): Promise<Driver> {
    const driver = await this.findOne(id);
    
    driver.currentLatitude = updateLocationDto.latitude;
    driver.currentLongitude = updateLocationDto.longitude;
    
    return await this.driverRepository.save(driver);
  }

  async updateStatus(id: number, status: DriverStatus): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.status = status;
    return await this.driverRepository.save(driver);
  }

  async incrementDeliveries(id: number): Promise<void> {
    await this.driverRepository.increment({ id }, 'totalDeliveries', 1);
  }

  async updateRating(id: number, rating: number): Promise<Driver> {
    const driver = await this.findOne(id);
    driver.rating = rating;
    return await this.driverRepository.save(driver);
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await this.driverRepository.findOne({
      where: { email }
    });
  }
} 