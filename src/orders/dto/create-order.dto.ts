import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  menuId: number;

  @ApiProperty({ example: 'Mie Gacoan Pedas' })
  @IsString()
  @IsNotEmpty()
  menuName: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiPropertyOptional({ example: 'Tanpa cabe' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({ example: '081234567890' })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional({ example: 10000 })
  @IsNumber()
  @IsOptional()
  deliveryFee?: number;
}

