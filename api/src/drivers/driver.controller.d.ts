import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { DriverStatus } from './driver.entity';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    create(createDriverDto: CreateDriverDto): Promise<{
        message: string;
        data: {
            id: number;
            fullName: string;
            email: string;
            phone: string;
            status: DriverStatus;
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: import("./driver.entity").Driver[];
    }>;
    findAvailableDrivers(): Promise<{
        message: string;
        data: import("./driver.entity").Driver[];
    }>;
    findOne(id: number): Promise<{
        message: string;
        data: import("./driver.entity").Driver;
    }>;
    updateLocation(id: number, updateLocationDto: UpdateLocationDto): Promise<{
        message: string;
        data: {
            id: number;
            currentLatitude: number | undefined;
            currentLongitude: number | undefined;
        };
    }>;
    updateStatus(id: number, body: {
        status: DriverStatus;
    }): Promise<{
        message: string;
        data: {
            id: number;
            status: DriverStatus;
        };
    }>;
}
