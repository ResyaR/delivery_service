import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, ValidateNested, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType } from '../order.entity';

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

  @ApiProperty({ example: 'Jl. Sudirman No. 123' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ example: 'Jakarta Selatan' })
  @IsString()
  @IsNotEmpty()
  deliveryCity: string;

  @ApiProperty({ example: 'DKI Jakarta' })
  @IsString()
  @IsNotEmpty()
  deliveryProvince: string;

  @ApiPropertyOptional({ example: '12190' })
  @IsString()
  @IsOptional()
  deliveryPostalCode?: string;

  @ApiProperty({ example: 1, description: 'Zona pengiriman (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  deliveryZone: number;

  @ApiPropertyOptional({ enum: DeliveryType, default: DeliveryType.REGULAR })
  @IsEnum(DeliveryType)
  @IsOptional()
  deliveryType?: DeliveryType;

  @ApiPropertyOptional({ example: '2024-12-25' })
  @IsString()
  @IsOptional()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '14:00' })
  @IsString()
  @IsOptional()
  scheduledTime?: string;

  @ApiPropertyOptional({ example: '13:00-17:00' })
  @IsString()
  @IsOptional()
  scheduleTimeSlot?: string;

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

