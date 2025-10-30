import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantService } from '../restaurants/restaurant.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private restaurantService: RestaurantService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate restaurant exists
    await this.restaurantService.findOne(createOrderDto.restaurantId);

    // Calculate totals
    const subtotal = createOrderDto.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const deliveryFee = createOrderDto.deliveryFee || 10000; // Default 10k
    const total = subtotal + deliveryFee;

    // Create order
    const order = this.orderRepository.create({
      userId,
      restaurantId: createOrderDto.restaurantId,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: createOrderDto.deliveryAddress,
      notes: createOrderDto.notes,
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = createOrderDto.items.map(item => 
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        menuId: item.menuId,
        menuName: item.menuName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })
    );

    await this.orderItemRepository.save(orderItems);

    // Increment restaurant order count
    await this.restaurantService.incrementOrderCount(createOrderDto.restaurantId);

    // Return order with items
    return await this.findOne(savedOrder.id);
  }

  async findAll(userId?: number, status?: string): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.user', 'user');
    
    if (userId) {
      query.where('order.userId = :userId', { userId });
    }
    
    if (status) {
      query.andWhere('order.status = :status', { status });
    }
    
    query.orderBy('order.createdAt', 'DESC');
    return await query.getMany();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'restaurant', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    await this.orderRepository.save(order);
    return await this.findOne(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.findAll(userId);
  }

  async getRestaurantOrders(restaurantId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { restaurantId },
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async calculateRevenue(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status IN (:...statuses)', { statuses: ['delivered', 'delivering', 'preparing'] })
      .getRawOne();
    
    return result?.total || 0;
  }

  async getTotalOrders(): Promise<number> {
    return await this.orderRepository.count();
  }
}

