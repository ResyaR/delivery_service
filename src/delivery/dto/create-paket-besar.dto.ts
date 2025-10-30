import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

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

