import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: 'preparing',
    enum: ['pending', 'preparing', 'delivering', 'delivered', 'cancelled']
  })
  @IsString()
  @IsIn(['pending', 'preparing', 'delivering', 'delivered', 'cancelled'])
  status: string;
}

