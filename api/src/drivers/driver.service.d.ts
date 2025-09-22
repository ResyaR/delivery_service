import { Repository } from 'typeorm';
import { Driver, DriverStatus } from './driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class DriverService {
    private driverRepository;
    constructor(driverRepository: Repository<Driver>);
    create(createDriverDto: CreateDriverDto): Promise<Driver>;
    findAll(): Promise<Driver[]>;
    findAvailableDrivers(): Promise<Driver[]>;
    findOne(id: number): Promise<Driver>;
    updateLocation(id: number, updateLocationDto: UpdateLocationDto): Promise<Driver>;
    updateStatus(id: number, status: DriverStatus): Promise<Driver>;
    incrementDeliveries(id: number): Promise<void>;
    updateRating(id: number, rating: number): Promise<Driver>;
    findByEmail(email: string): Promise<Driver | null>;
}
