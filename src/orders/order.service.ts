import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, DeliveryType } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantService } from '../restaurants/restaurant.service';
import { ShippingManagerService } from '../shipping-managers/shipping-manager.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private restaurantService: RestaurantService,
    private shippingManagerService: ShippingManagerService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate restaurant exists
    await this.restaurantService.findOne(createOrderDto.restaurantId);

    // Calculate totals
    const subtotal = createOrderDto.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Calculate delivery fee based on type
    let deliveryFee = createOrderDto.deliveryFee || 10000; // Default 10k
    if (createOrderDto.deliveryType === DeliveryType.EXPRESS) {
      deliveryFee = deliveryFee * 1.5; // Express is 50% more expensive
    }
    
    const total = subtotal + deliveryFee;

    // Assign shipping manager based on zone
    let shippingManagerId: number | null = null;
    try {
      const shippingManagers = await this.shippingManagerService.findByZone(createOrderDto.deliveryZone);
      if (shippingManagers.length > 0) {
        // Assign to first available shipping manager in the zone
        // In production, you might want to use round-robin or load balancing
        shippingManagerId = shippingManagers[0].id;
      }
    } catch (error) {
      // If no shipping manager found for zone, continue without assignment
      console.warn(`No shipping manager found for zone ${createOrderDto.deliveryZone}`);
    }

    // Create order
    const order = this.orderRepository.create({
      userId,
      restaurantId: createOrderDto.restaurantId,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryCity: createOrderDto.deliveryCity,
      deliveryProvince: createOrderDto.deliveryProvince,
      deliveryPostalCode: createOrderDto.deliveryPostalCode,
      deliveryZone: createOrderDto.deliveryZone,
      deliveryType: createOrderDto.deliveryType || DeliveryType.REGULAR,
      scheduledDate: createOrderDto.scheduledDate ? new Date(createOrderDto.scheduledDate) : null,
      scheduledTime: createOrderDto.scheduledTime || null,
      scheduleTimeSlot: createOrderDto.scheduleTimeSlot || null,
      shippingManagerId,
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
      relations: ['items', 'restaurant', 'user', 'shippingManager'],
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

