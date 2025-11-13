import { ShippingManagerService } from './shipping-manager.service';
import { CreateShippingManagerDto } from './dto/create-shipping-manager.dto';
import { CreateShippingManagerWithUserDto } from './dto/create-shipping-manager-with-user.dto';
import { UpdateShippingManagerDto } from './dto/update-shipping-manager.dto';
export declare class ShippingManagerController {
    private readonly shippingManagerService;
    constructor(shippingManagerService: ShippingManagerService);
    create(createDto: CreateShippingManagerDto): Promise<import("./shipping-manager.entity").ShippingManager>;
    createWithUser(createDto: CreateShippingManagerWithUserDto): Promise<import("./shipping-manager.entity").ShippingManager>;
    findAll(): Promise<import("./shipping-manager.entity").ShippingManager[]>;
    findByZone(zone: string): Promise<import("./shipping-manager.entity").ShippingManager[]>;
    findOne(id: string): Promise<import("./shipping-manager.entity").ShippingManager>;
    update(id: string, updateDto: UpdateShippingManagerDto): Promise<import("./shipping-manager.entity").ShippingManager>;
    regenerateToken(id: string): Promise<import("./shipping-manager.entity").ShippingManager>;
    remove(id: string): Promise<void>;
    login(body: {
        token: string;
    }): Promise<{
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            phone: string;
            zone: number;
            token: string;
        };
    }>;
}
