import { DeliveryType } from './delivery-type.enum';
export declare class BarangDto {
    itemName: string;
    scale: string;
}
export declare class CreateDeliveryDto {
    pickupLocation: string;
    dropoffLocation: string;
    barang?: BarangDto;
    jadwal?: string;
    titipDeskripsi?: string;
    price?: number;
    type: DeliveryType;
}
export declare class CreateTitipBeliDto {
    pickupLocation: string;
    dropoffLocation: string;
    titipDeskripsi: string;
    price?: number;
}
