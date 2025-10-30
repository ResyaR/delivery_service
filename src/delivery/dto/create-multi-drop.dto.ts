import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DropLocationDto {
  @IsNumber()
  sequence: number;

  @IsString()
  locationName: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreateMultiDropDeliveryDto {
  @IsString()
  pickupLocation: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DropLocationDto)
  dropLocations: DropLocationDto[]; // Array of destinations

  @IsNumber()
  estimatedDistance: number; // Total km

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  packageDescription?: string;
}

