export declare class CreateScheduledDeliveryDto {
    pickupLocation: string;
    dropoffLocation: string;
    scheduledDate: string;
    scheduleTimeSlot: string;
    barang?: {
        itemName: string;
        scale: string;
    };
    notes?: string;
}
