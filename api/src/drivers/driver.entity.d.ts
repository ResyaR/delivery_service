export declare enum DriverStatus {
    AVAILABLE = "available",
    BUSY = "busy",
    OFFLINE = "offline"
}
export declare class Driver {
    id: number;
    fullName: string;
    email: string;
    password: string;
    phone: string;
    vehicleNumber?: string;
    vehicleType?: string;
    status: DriverStatus;
    currentLatitude?: number;
    currentLongitude?: number;
    avatar?: string;
    refreshToken?: string;
    totalDeliveries: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}
