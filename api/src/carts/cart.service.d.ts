import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Menu } from '../menus/menu.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private menuRepository;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, menuRepository: Repository<Menu>);
    getCart(userId: number): Promise<CartResponseDto>;
    addItemToCart(userId: number, addItemDto: AddItemToCartDto): Promise<CartResponseDto>;
    updateCartItem(userId: number, itemId: number, updateDto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeItemFromCart(userId: number, itemId: number): Promise<CartResponseDto>;
    clearCart(userId: number): Promise<void>;
    private mapToResponseDto;
}
