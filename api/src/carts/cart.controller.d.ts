import { CartService } from './cart.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { User } from '../users/user.entity';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: User): Promise<CartResponseDto>;
    addItemToCart(user: User, addItemDto: AddItemToCartDto): Promise<CartResponseDto>;
    updateCartItem(user: User, itemId: number, updateDto: UpdateCartItemDto): Promise<CartResponseDto>;
    removeItemFromCart(user: User, itemId: number): Promise<CartResponseDto>;
    clearCart(user: User): Promise<void>;
}
