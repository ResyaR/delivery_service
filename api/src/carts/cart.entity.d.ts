import { User } from '../users/user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: number;
    userId: number;
    user: User;
    restaurantId: number | null;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}
