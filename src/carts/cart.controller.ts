import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Cart')
@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartResponseDto })
  async getCart(@GetUser() user: User): Promise<CartResponseDto> {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., menu not available, different restaurant)' })
  async addItemToCart(
    @GetUser() user: User,
    @Body() addItemDto: AddItemToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addItemToCart(user.id, addItemDto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  async updateCartItem(
    @GetUser() user: User,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(user.id, itemId, updateDto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart or cart item not found' })
  async removeItemFromCart(
    @GetUser() user: User,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.removeItemFromCart(user.id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  async clearCart(@GetUser() user: User): Promise<void> {
    return this.cartService.clearCart(user.id);
  }
}

