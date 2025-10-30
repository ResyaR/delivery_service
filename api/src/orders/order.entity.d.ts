import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderItem } from './order-item.entity';
export declare class Order {
    id: number;
    userId: number;
    user: User;
    restaurantId: number;
    restaurant: Restaurant;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    status: string;
    notes: string;
    customerName: string;
    customerPhone: string;
    createdAt: Date;
    updatedAt: Date;
}
