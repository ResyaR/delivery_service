import { DeliveryType } from './delivery-type.enum';
import { DeliveryStatus } from '../delivery.entity';
export declare class DeliveryResponseDto {
    id: number;
    userId: number;
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
export declare class DeliveryListResponseDto {
    message: string;
    data: DeliveryResponseDto[];
}
export declare class DeliveryDetailResponseDto {
    message: string;
    data: DeliveryResponseDto;
}
export declare class DeliveryCreateResponseDto {
    message: string;
    data: DeliveryResponseDto;
}
