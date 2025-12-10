export declare class CreateScheduledDeliveryDto {
    pickupLocation: string;
    dropoffLocation: string;
    scheduledDate: string;
    scheduleTimeSlot: string;
    zone?: number;
    originCityId?: number;
    destCityId?: number;
    serviceId?: number;
    weight?: number;
    barang?: {
        itemName: string;
        scale: string;
    };
    notes?: string;
}
