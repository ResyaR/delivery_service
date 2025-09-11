import { ApiProperty } from '@nestjs/swagger';
import { DeliveryType } from './delivery-type.enum';
import { DeliveryStatus } from '../delivery.entity';

export class DeliveryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'Jl. Merdeka No.1' })
  pickupLocation: string;

  @ApiProperty({ example: 'Jl. Sudirman No.2' })
  dropoffLocation: string;

  @ApiProperty({ example: { itemName: 'Dokumen', scale: 'Ringan' }, required: false })
  barang?: {
    itemName: string;
    scale: string;
  };

  @ApiProperty({ example: 'Beli barang di Indomaret', required: false })
  titipDeskripsi?: string;

  @ApiProperty({ example: '2025-07-08T10:00:00Z', required: false })
  jadwal?: Date;

  @ApiProperty({ example: 25000 })
  price: number;

  @ApiProperty({ enum: DeliveryType })
  type: DeliveryType;

  @ApiProperty({ enum: DeliveryStatus })
  status: DeliveryStatus;

  @ApiProperty({ example: 1, required: false })
  driverId?: number;

  @ApiProperty({ example: '2025-07-08T12:00:00Z', required: false })
  estimatedArrival?: Date;

  @ApiProperty({ example: '2025-07-08T12:30:00Z', required: false })
  actualArrival?: Date;

  @ApiProperty({ example: 'Catatan tambahan', required: false })
  notes?: string;

  @ApiProperty({ example: '2025-07-08T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-08T10:00:00Z' })
  updatedAt: Date;
}

export class DeliveryListResponseDto {
  @ApiProperty({ example: 'Delivery history fetched' })
  message: string;

  @ApiProperty({ type: [DeliveryResponseDto] })
  data: DeliveryResponseDto[];
}

export class DeliveryDetailResponseDto {
  @ApiProperty({ example: 'Delivery status fetched' })
  message: string;

  @ApiProperty({ type: DeliveryResponseDto })
  data: DeliveryResponseDto;
}

export class DeliveryCreateResponseDto {
  @ApiProperty({ example: 'Kirim Sekarang request created' })
  message: string;

  @ApiProperty({ type: DeliveryResponseDto })
  data: DeliveryResponseDto;
}
