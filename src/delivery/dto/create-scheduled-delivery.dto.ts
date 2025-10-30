import { IsString, IsDateString, IsOptional, IsObject } from 'class-validator';

export class CreateScheduledDeliveryDto {
  @IsString()
  pickupLocation: string;

  @IsString()
  dropoffLocation: string;

  @IsDateString()
  scheduledDate: string; // YYYY-MM-DD

  @IsString()
  scheduleTimeSlot: string; // "09:00-12:00", "13:00-17:00", "17:00-20:00"

  @IsObject()
  @IsOptional()
  barang?: {
    itemName: string;
    scale: string;
  };

  @IsString()
  @IsOptional()
  notes?: string;
}

