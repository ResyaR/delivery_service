export declare class CartItemResponseDto {
    id: number;
    menuId: number;
    menuName: string;
    menuImage: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}
export declare class CartResponseDto {
    id: number;
    userId: number;
    restaurantId: number | null;
    restaurantName: string | null;
    items: CartItemResponseDto[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
