import { User } from '../users/user.entity';
import { DeliveryType } from './dto/delivery-type.enum';
import { MultiDropLocation } from './multi-drop-location.entity';
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
    multiDropLocations?: MultiDropLocation[];
    packageDetails?: {
        weight: number;
        length: number;
        width: number;
        height: number;
        volumeWeight?: number;
        category?: string;
        isFragile?: boolean;
        requiresHelper?: boolean;
    };
    scheduledDate?: Date;
    scheduledTime?: string;
    scheduleTimeSlot?: string;
    deliveryZone?: number;
    shippingManagerId?: number;
    totalDropPoints?: number;
    totalDistance?: number;
    createdAt: Date;
    updatedAt: Date;
}
