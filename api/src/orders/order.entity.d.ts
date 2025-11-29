import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderItem } from './order-item.entity';
import { ShippingManager } from '../shipping-managers/shipping-manager.entity';
export declare enum DeliveryType {
    REGULAR = "regular",
    EXPRESS = "express",
    SCHEDULED = "scheduled"
}
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
    deliveryAddressLabel: string;
    deliveryCity: string;
    deliveryProvince: string;
    deliveryPostalCode: string;
    deliveryZone: number;
    deliveryType: DeliveryType;
    scheduledDate: Date;
    scheduledTime: string;
    scheduleTimeSlot: string;
    shippingManagerId: number;
    shippingManager: ShippingManager;
    status: string;
    notes: string;
    customerName: string;
    customerPhone: string;
    orderNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
