import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Menu } from '../menus/menu.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto, CartItemResponseDto } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async getCart(userId: number): Promise<CartResponseDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.menu', 'items.menu.restaurant'],
    });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
    }

    // Get restaurant ID from first item if available
    if (cart.items && cart.items.length > 0 && cart.items[0].menu?.restaurant) {
      cart.restaurantId = cart.items[0].menu.restaurant.id;
      await this.cartRepository.save(cart);
    }

    return this.mapToResponseDto(cart);
  }

  async addItemToCart(userId: number, addItemDto: AddItemToCartDto): Promise<CartResponseDto> {
    // Find or create cart
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.menu', 'items.menu.restaurant'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
      // CRITICAL: Reload cart after save to ensure id is populated from database
      cart = await this.cartRepository.findOne({
        where: { userId },
        relations: ['items', 'items.menu', 'items.menu.restaurant'],
      });
      if (!cart || !cart.id) {
        throw new Error('Failed to create cart with valid ID');
      }
    }

    // CRITICAL: Ensure cart.id is always set before proceeding
    // This can happen if cart was loaded but id wasn't populated correctly
    if (!cart.id) {
      // Reload cart to ensure id is populated
      cart = await this.cartRepository.findOne({
        where: { userId },
        relations: ['items', 'items.menu', 'items.menu.restaurant'],
      });
      if (!cart || !cart.id) {
        throw new Error('Failed to load or create cart with valid ID');
      }
    }

    // Verify menu exists
    const menu = await this.menuRepository.findOne({
      where: { id: addItemDto.menuId },
      relations: ['restaurant'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${addItemDto.menuId} not found`);
    }

    if (!menu.availability) {
      throw new BadRequestException(`Menu ${menu.name} is not available`);
    }

    // Check if cart already has items from a different restaurant
    if (cart.items && cart.items.length > 0) {
      // Get existing restaurant ID from cart's restaurantId or first item's menu
      const existingRestaurantId = cart.restaurantId || 
        (cart.items[0].menu?.restaurant?.id);
      const newRestaurantId = menu.restaurant.id;

      if (existingRestaurantId && existingRestaurantId !== newRestaurantId) {
        throw new BadRequestException(
          'Cannot add items from different restaurants. Please clear your cart first.'
        );
      }
    }

    // Check if item already exists in cart
    const existingItem = cart.items?.find(item => item.menuId === addItemDto.menuId);

    if (existingItem) {
      // CRITICAL: Use query builder to update only quantity and price
      // This avoids touching cartId which might cause issues if cart.id is undefined
      const existingItemId = existingItem.id;
      if (!existingItemId) {
        throw new Error('Existing cart item has no ID');
      }
      
      // Get current item to verify it exists and get current quantity
      const currentItem = await this.cartItemRepository.findOne({
        where: { id: existingItemId },
        select: ['id', 'quantity'], // Only select what we need
      });
      
      if (!currentItem) {
        throw new NotFoundException(`Cart item with ID ${existingItemId} not found`);
      }
      
      // Use query builder to update only quantity and price
      // This is safer because we don't modify cartId at all
      // cartId remains unchanged from the database value
      await this.cartItemRepository
        .createQueryBuilder()
        .update(CartItem)
        .set({
          quantity: currentItem.quantity + addItemDto.quantity,
          price: menu.price,
        })
        .where('id = :id', { id: existingItemId })
        .execute();
    } else {
      // Create new cart item
      // CRITICAL: Double-check cart.id is still valid and reload if needed
      if (!cart.id) {
        // Reload cart one more time to ensure id is valid
        cart = await this.cartRepository.findOne({
          where: { userId },
          select: ['id'], // Only select id for performance
        });
        if (!cart || !cart.id) {
          throw new Error(`Cart ID is undefined when creating new cart item. User ID: ${userId}`);
        }
      }
      
      // Use query builder to insert directly - more reliable than save()
      // This ensures cartId is always set correctly
      await this.cartItemRepository
        .createQueryBuilder()
        .insert()
        .into(CartItem)
        .values({
          cartId: cart.id,
          menuId: addItemDto.menuId,
          quantity: addItemDto.quantity,
          price: menu.price,
        })
        .execute();
    }

    // Update cart restaurant ID
    cart.restaurantId = menu.restaurant.id;
    await this.cartRepository.save(cart);

    // Reload cart with relations
    const reloadedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.menu', 'items.menu.restaurant'],
    });

    if (!reloadedCart) {
      throw new NotFoundException('Cart not found after adding item');
    }

    return this.mapToResponseDto(reloadedCart);
  }

  async updateCartItem(userId: number, itemId: number, updateDto: UpdateCartItemDto): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.menu'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Verify menu is still available and update price
    // CRITICAL: Always ensure cartId is set before save to satisfy NOT NULL constraint
    // This can happen if item was loaded via relation and cartId wasn't populated
    cartItem.cartId = cart.id;
    const menu = await this.menuRepository.findOne({
      where: { id: cartItem.menuId },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${cartItem.menuId} not found`);
    }

    if (!menu.availability) {
      throw new BadRequestException(`Menu ${menu.name} is not available`);
    }

    cartItem.quantity = updateDto.quantity;
    cartItem.price = menu.price; // Update price in case it changed
    await this.cartItemRepository.save(cartItem);

    // Reload cart with relations
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.menu', 'items.menu.restaurant'],
    });

    if (!updatedCart) {
      throw new NotFoundException('Cart not found after updating item');
    }

    return this.mapToResponseDto(updatedCart);
  }

  async removeItemFromCart(userId: number, itemId: number): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.id === itemId);
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Defensive: ensure the item belongs to this cart; prevent accidental cross-cart update
    if (cartItem.cartId !== cart.id) {
      throw new NotFoundException('Cart item does not belong to this cart');
    }

    await this.cartItemRepository.remove(cartItem);

    // Reload cart with relations
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.menu', 'items.menu.restaurant'],
    });

    if (!updatedCart) {
      throw new NotFoundException('Cart not found after removing item');
    }

    // Update restaurant ID if cart is empty
    if (updatedCart.items.length === 0) {
      updatedCart.restaurantId = null;
      await this.cartRepository.save(updatedCart);
    }

    return this.mapToResponseDto(updatedCart);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      return; // Cart doesn't exist, nothing to clear
    }

    // Remove all cart items
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }

    // Reset restaurant ID
    cart.restaurantId = null;
    await this.cartRepository.save(cart);
  }

  private mapToResponseDto(cart: Cart): CartResponseDto {
    const items: CartItemResponseDto[] = (cart.items || []).map(item => ({
      id: item.id,
      menuId: item.menuId,
      menuName: item.menu?.name || 'Unknown Menu',
      menuImage: item.menu?.image || null,
      price: Number(item.price),
      quantity: item.quantity,
      subtotal: Number(item.price) * item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Get restaurant name from first item's menu if available
    const restaurantName = cart.items && cart.items.length > 0 && cart.items[0].menu?.restaurant
      ? cart.items[0].menu.restaurant.name
      : null;

    return {
      id: cart.id,
      userId: cart.userId,
      restaurantId: cart.restaurantId,
      restaurantName,
      items,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}

