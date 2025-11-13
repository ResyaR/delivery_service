import { DeliveryType } from '../order.entity';
export declare class OrderItemDto {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
}
export declare class CreateOrderDto {
    restaurantId: number;
    items: OrderItemDto[];
    deliveryAddress: string;
    deliveryCity: string;
    deliveryProvince: string;
    deliveryPostalCode?: string;
    deliveryZone: number;
    deliveryType?: DeliveryType;
    scheduledDate?: string;
    scheduledTime?: string;
    scheduleTimeSlot?: string;
    notes?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryFee?: number;
}
