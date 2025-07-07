import { ApiProperty } from '@nestjs/swagger';
import { DeliveryType } from './delivery-type.enum';

export class DeliveryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  pickupLocation: string;

  @ApiProperty()
  dropoffLocation: string;

  @ApiProperty({
    type: 'object',
    properties: {
      itemName: { type: 'string', example: 'Dokumen' },
      scale: { type: 'string', example: 'Ringan' }
    },
    required: ['itemName', 'scale']
  })
  barang: { itemName: string; scale: string };

  @ApiProperty({ required: false })
  jadwal?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ enum: DeliveryType })
  type: DeliveryType;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
