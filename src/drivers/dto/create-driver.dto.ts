import { IsEmail, IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DriverStatus } from '../driver.entity';

export class CreateDriverDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'driver@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: '+6281234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'B 1234 ABC', required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiProperty({ example: 'Motor', required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiProperty({ enum: DriverStatus, default: DriverStatus.OFFLINE })
  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @ApiProperty({ example: -6.2088, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  currentLatitude?: number;

  @ApiProperty({ example: 106.8456, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  currentLongitude?: number;
} 