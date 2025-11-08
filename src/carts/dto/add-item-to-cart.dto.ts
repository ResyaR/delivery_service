import { IsNumber, IsInt, Min, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto {
  @ApiProperty({ description: 'Menu ID to add to cart', example: 1 })
  @IsNumber()
  @IsInt()
  @IsPositive()
  menuId: number;

  @ApiProperty({ description: 'Quantity of the menu item', example: 2, minimum: 1 })
  @IsNumber()
  @IsInt()
  @Min(1)
  quantity: number;
}

