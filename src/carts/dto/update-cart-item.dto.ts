import { IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity for the cart item', example: 3, minimum: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  quantity: number;
}

