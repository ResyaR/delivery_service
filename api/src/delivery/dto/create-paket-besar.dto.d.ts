export declare class CreatePaketBesarDto {
    pickupLocation: string;
    dropoffLocation: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    zone?: number;
    category?: string;
    isFragile?: boolean;
    requiresHelper?: boolean;
    notes?: string;
    scheduledDate?: string;
    scheduleTimeSlot?: string;
}
