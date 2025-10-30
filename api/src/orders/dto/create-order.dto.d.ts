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
    notes?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryFee?: number;
}
