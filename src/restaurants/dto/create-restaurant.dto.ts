import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Mie Gacoan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Restaurant mie pedas terbaik' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '/mie-gacoan-restaurant.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'Noodles' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: 'Jl. Sudirman No. 123' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsString()
  @IsOptional()
  openingTime?: string;

  @ApiPropertyOptional({ example: '22:00' })
  @IsString()
  @IsOptional()
  closingTime?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

