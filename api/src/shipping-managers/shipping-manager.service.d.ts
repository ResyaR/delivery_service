import { Repository } from 'typeorm';
import { ShippingManager } from './shipping-manager.entity';
import { CreateShippingManagerDto } from './dto/create-shipping-manager.dto';
import { CreateShippingManagerWithUserDto } from './dto/create-shipping-manager-with-user.dto';
import { UpdateShippingManagerDto } from './dto/update-shipping-manager.dto';
import { UserService } from '../users/user.service';
export declare class ShippingManagerService {
    private shippingManagerRepository;
    private userService;
    constructor(shippingManagerRepository: Repository<ShippingManager>, userService: UserService);
    private generateToken;
    create(createDto: CreateShippingManagerDto): Promise<ShippingManager>;
    createWithUser(createDto: CreateShippingManagerWithUserDto): Promise<ShippingManager>;
    findAll(): Promise<ShippingManager[]>;
    findByZone(zone: number): Promise<ShippingManager[]>;
    findOne(id: number): Promise<ShippingManager>;
    findByToken(token: string): Promise<ShippingManager>;
    update(id: number, updateDto: UpdateShippingManagerDto): Promise<ShippingManager>;
    regenerateToken(id: number): Promise<ShippingManager>;
    remove(id: number): Promise<void>;
}
