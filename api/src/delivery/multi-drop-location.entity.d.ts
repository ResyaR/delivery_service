import { Delivery } from './delivery.entity';
export declare class MultiDropLocation {
    id: number;
    deliveryId: number;
    delivery: Delivery;
    sequence: number;
    locationName: string;
    address: string;
    recipientName?: string;
    recipientPhone?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
    arrivedAt?: Date;
    isCompleted: boolean;
}
