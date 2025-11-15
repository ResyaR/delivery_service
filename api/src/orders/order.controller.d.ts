import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ShippingManagerService } from '../shipping-managers/shipping-manager.service';
export declare class OrderController {
    private readonly orderService;
    private readonly shippingManagerService;
    private readonly ADMIN_KEY;
    constructor(orderService: OrderService, shippingManagerService: ShippingManagerService);
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
    trackOrder(req: any, orderNumber: string): Promise<{
        message: string;
        data: import("./order.entity").Order;
    }>;
    trackOrderPublic(orderNumber: string): Promise<{
        message: string;
        data: import("./order.entity").Order;
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
    getOrdersByZone(token: string, zone: string, status?: string): Promise<{
        message: string;
        data: import("./order.entity").Order[];
    }>;
    getMyShippingManagerOrders(token: string, status?: string): Promise<{
        message: string;
        data: import("./order.entity").Order[];
    }>;
    updateStatusByShippingManager(token: string, id: string, updateStatusDto: UpdateOrderStatusDto): Promise<{
        message: string;
        data: import("./order.entity").Order;
    }>;
}
