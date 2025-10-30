import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({ example: 'Mie Gacoan Pedas Level 5' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Mie pedas dengan level tertinggi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ example: '/food/mie-gacoan.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'Noodles' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  availability?: boolean;
}

