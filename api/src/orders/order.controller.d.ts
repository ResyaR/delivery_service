import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrderController {
    private readonly orderService;
    private readonly ADMIN_KEY;
    constructor(orderService: OrderService);
    private validateAdminKey;
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
        message: string;
        data: import("./order.entity").Order;
    }>;
    findAll(adminKey: string, userId?: string, status?: string): Promise<{
        message: string;
        data: import("./order.entity").Order[];
    }>;
    getMyOrders(req: any): Promise<{
        message: string;
        data: import("./order.entity").Order[];
    }>;
    getRestaurantOrders(adminKey: string, restaurantId: string): Promise<{
        message: string;
        data: import("./order.entity").Order[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./order.entity").Order;
    }>;
    updateStatus(adminKey: string, id: string, updateStatusDto: UpdateOrderStatusDto): Promise<{
        message: string;
        data: import("./order.entity").Order;
    }>;
}
