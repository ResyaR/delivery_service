import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantService } from '../restaurants/restaurant.service';
export declare class OrderService {
    private orderRepository;
    private orderItemRepository;
    private restaurantService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, restaurantService: RestaurantService);
    create(userId: number, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(userId?: number, status?: string): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    updateStatus(id: number, status: string): Promise<Order>;
    getUserOrders(userId: number): Promise<Order[]>;
    getRestaurantOrders(restaurantId: number): Promise<Order[]>;
    calculateRevenue(): Promise<number>;
    getTotalOrders(): Promise<number>;
}
