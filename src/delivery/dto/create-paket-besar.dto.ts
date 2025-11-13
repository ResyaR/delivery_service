import { IsString, IsNumber, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePaketBesarDto {
  @IsString()
  pickupLocation: string;

  @IsString()
  dropoffLocation: string;

  @IsNumber()
  weight: number; // kg

  @IsNumber()
  length: number; // cm

  @IsNumber()
  width: number; // cm

  @IsNumber()
  height: number; // cm

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  zone?: number; // Delivery zone 1-5

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isFragile?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresHelper?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  scheduledDate?: string; // Optional schedule

  @IsString()
  @IsOptional()
  scheduleTimeSlot?: string;
}

