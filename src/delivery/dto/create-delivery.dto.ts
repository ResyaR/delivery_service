import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType } from './delivery-type.enum';

export class BarangDto {
  @ApiProperty({ example: 'Dokumen', description: 'Nama barang' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ example: 'Ringan', description: 'Skala/berat barang' })
  @IsString()
  @IsNotEmpty()
  scale: string;
}

export class CreateDeliveryDto {
  @ApiProperty({ example: 'Jl. Merdeka No.1', description: 'Lokasi penjemputan' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({ example: 'Jl. Sudirman No.2', description: 'Lokasi tujuan' })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @ApiProperty({ type: BarangDto, required: false, description: 'Barang untuk kirim/jadwal. Tidak wajib untuk titip beli.' })
  @ValidateNested()
  @Type(() => BarangDto)
  @IsOptional()
  barang?: BarangDto;

  @ApiPropertyOptional({ example: '2025-07-08T10:00:00Z', description: 'Jadwal pengantaran (opsional)' })
  @IsOptional()
  @IsDateString()
  jadwal?: string;

  @ApiPropertyOptional({ example: 'Beli barang di Indomaret', description: 'Deskripsi titip beli (khusus TITIP_BELI)' })
  @IsOptional()
  @IsString()
  titipDeskripsi?: string;

  @ApiPropertyOptional({ example: 25000, description: 'Estimasi harga (opsional)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ enum: DeliveryType })
  @IsEnum(DeliveryType)
  type: DeliveryType;
}

// DTO khusus untuk titip beli dengan validasi wajib titipDeskripsi
export class CreateTitipBeliDto {
  @ApiProperty({ example: 'Jl. Merdeka No.1', description: 'Lokasi penjemputan' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({ example: 'Jl. Sudirman No.2', description: 'Lokasi tujuan' })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @ApiProperty({ example: 'Beli barang di Indomaret', description: 'Deskripsi titip beli' })
  @IsString()
  @IsNotEmpty()
  titipDeskripsi: string;

  @ApiPropertyOptional({ example: 25000, description: 'Estimasi harga (opsional)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
