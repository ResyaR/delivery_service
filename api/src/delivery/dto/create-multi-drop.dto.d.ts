export declare class DropLocationDto {
    sequence: number;
    locationName: string;
    address: string;
    recipientName?: string;
    recipientPhone?: string;
    notes?: string;
    latitude?: number;
    longitude?: number;
}
export declare class CreateMultiDropDeliveryDto {
    pickupLocation: string;
    dropLocations: DropLocationDto[];
    estimatedDistance: number;
    notes?: string;
    packageDescription?: string;
}
