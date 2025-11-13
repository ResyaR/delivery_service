import { Order } from '../orders/order.entity';
export declare class ShippingManager {
    id: number;
    name: string;
    email: string;
    phone: string;
    zone: number;
    token: string;
    isActive: boolean;
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
