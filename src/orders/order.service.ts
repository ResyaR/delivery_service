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
    
    // Biaya aplikasi 10% dari subtotal + deliveryFee (makanan + driver)
    const appFee = (subtotal + deliveryFee) * 0.1;
    
    const total = subtotal + deliveryFee + appFee;

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

    // Generate orderNumber format MT-XXXXXX (kombinasi huruf dan angka)
    let orderNumber: string = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Function to generate random alphanumeric string
    const generateRandomCode = (length: number): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    while (!isUnique && attempts < maxAttempts) {
      // Generate 6-character alphanumeric code (contoh: MT-A1B2C3, MT-X9Y8Z7)
      const randomCode = generateRandomCode(6);
      orderNumber = `MT-${randomCode}`;
      
      // Check if orderNumber already exists (must be globally unique)
      const existing = await this.orderRepository.findOne({
        where: { orderNumber },
      });
      
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique || !orderNumber) {
      // Fallback: use timestamp-based code if random generation fails
      const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
      orderNumber = `MT-${timestamp}`;
    }

    // Create order
    const order = this.orderRepository.create({
      userId,
      restaurantId: createOrderDto.restaurantId,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryAddressLabel: createOrderDto.deliveryAddressLabel,
      deliveryCity: createOrderDto.deliveryCity,
      deliveryProvince: createOrderDto.deliveryProvince,
      deliveryPostalCode: createOrderDto.deliveryPostalCode,
      deliveryZone: createOrderDto.deliveryZone,
      deliveryType: createOrderDto.deliveryType || DeliveryType.REGULAR,
      scheduledDate: createOrderDto.scheduledDate ? new Date(createOrderDto.scheduledDate) : undefined,
      scheduledTime: createOrderDto.scheduledTime || undefined,
      scheduleTimeSlot: createOrderDto.scheduleTimeSlot || undefined,
      shippingManagerId: shippingManagerId || undefined,
      notes: createOrderDto.notes,
      customerName: createOrderDto.customerName,
      customerPhone: createOrderDto.customerPhone,
      orderNumber: orderNumber,
      status: 'pending',
    } as Partial<Order>);
    
    const savedOrder = await this.orderRepository.save(order) as Order;

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

  async findByZone(zone: number, status?: string): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.shippingManager', 'shippingManager')
      .where('order.deliveryZone = :zone', { zone });
    
    if (status) {
      query.andWhere('order.status = :status', { status });
    }
    
    query.orderBy('order.createdAt', 'DESC');
    
    const orders = await query.getMany();
    console.log(`[OrderService] findByZone: Found ${orders.length} orders for zone ${zone}${status ? ` with status ${status}` : ''}`);
    
    // Debug: log first order if exists
    if (orders.length > 0) {
      console.log(`[OrderService] First order: ID=${orders[0].id}, Zone=${orders[0].deliveryZone}, Status=${orders[0].status}`);
    } else {
      // Check if there are any orders with this zone
      const allOrders = await this.orderRepository.find({ where: { deliveryZone: zone } });
      console.log(`[OrderService] Debug: Total orders with zone ${zone} in DB: ${allOrders.length}`);
    }
    
    return orders;
  }

  async findByShippingManager(shippingManagerId: number, status?: string): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.shippingManager', 'shippingManager')
      .where('order.shippingManagerId = :shippingManagerId', { shippingManagerId });
    
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

  async findByOrderNumber(userId: number, orderNumber: string): Promise<Order> {
    // Normalize orderNumber (support both "MT-XXXXXX" and "XXXXXX")
    let normalizedOrderNumber = orderNumber.trim().toUpperCase();
    if (!normalizedOrderNumber.startsWith('MT-')) {
      normalizedOrderNumber = `MT-${normalizedOrderNumber}`;
    }
    
    if (!normalizedOrderNumber.match(/^MT-[A-Z0-9]{6}$/)) {
      throw new NotFoundException('Nomor resi tidak valid. Format: MT-XXXXXX (6 karakter huruf/angka)');
    }
    
    const order = await this.orderRepository.findOne({
      where: { orderNumber: normalizedOrderNumber },
      relations: ['items', 'restaurant', 'user', 'shippingManager'],
    });
    
    if (!order) {
      throw new NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
    }
    
    // Verify order belongs to the user
    if (order.userId !== userId) {
      throw new NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
    }
    
    return order;
  }

  // Public method untuk cek resi tanpa login (hanya dengan orderNumber)
  async findByOrderNumberPublic(orderNumber: string): Promise<Order> {
    // Normalize orderNumber (support both "MT-XXXXXX" and "XXXXXX")
    let normalizedOrderNumber = orderNumber.trim().toUpperCase();
    if (!normalizedOrderNumber.startsWith('MT-')) {
      normalizedOrderNumber = `MT-${normalizedOrderNumber}`;
    }
    
    if (!normalizedOrderNumber.match(/^MT-[A-Z0-9]{6}$/)) {
      throw new NotFoundException('Nomor resi tidak valid. Format: MT-XXXXXX (6 karakter huruf/angka)');
    }
    
    const order = await this.orderRepository.findOne({
      where: { orderNumber: normalizedOrderNumber },
      relations: ['items', 'restaurant', 'user', 'shippingManager'],
    });
    
    if (!order) {
      throw new NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
    }
    
    return order;
  }
}

