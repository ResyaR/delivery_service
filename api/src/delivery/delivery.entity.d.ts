import { User } from '../users/user.entity';
import { DeliveryType } from './dto/delivery-type.enum';
export declare enum DeliveryStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    PICKED_UP = "picked_up",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Delivery {
    id: number;
    userId: number;
    user: User;
    pickupLocation: string;
    dropoffLocation: string;
    barang?: {
        itemName: string;
        scale: string;
    };
    titipDeskripsi?: string;
    jadwal?: Date;
    price: number;
    type: DeliveryType;
    status: DeliveryStatus;
    driverId?: number;
    estimatedArrival?: Date;
    actualArrival?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
