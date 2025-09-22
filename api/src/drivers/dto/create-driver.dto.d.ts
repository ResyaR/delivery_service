import { DriverStatus } from '../driver.entity';
export declare class CreateDriverDto {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    vehicleNumber?: string;
    vehicleType?: string;
    status?: DriverStatus;
    currentLatitude?: number;
    currentLongitude?: number;
}
