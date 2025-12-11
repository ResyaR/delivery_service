import { Restaurant } from '../restaurants/restaurant.entity';
export declare class Menu {
    id: number;
    restaurantId: number;
    restaurant: Restaurant;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    availability: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
