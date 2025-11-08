import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  menuId: number;

  @ApiProperty()
  menuName: string;

  @ApiProperty()
  menuImage: string | null;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  subtotal: number;
}

export class CartResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ nullable: true })
  restaurantId: number | null;

  @ApiProperty({ nullable: true })
  restaurantName: string | null;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

