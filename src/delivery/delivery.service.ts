import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { Delivery, DeliveryStatus } from './delivery.entity';
import { MultiDropLocation } from './multi-drop-location.entity';
import { CreateMultiDropDeliveryDto, DropLocationDto } from './dto/create-multi-drop.dto';
import { CreateScheduledDeliveryDto } from './dto/create-scheduled-delivery.dto';
import { CreatePaketBesarDto } from './dto/create-paket-besar.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(MultiDropLocation)
    private multiDropLocationRepository: Repository<MultiDropLocation>,
  ) {}

  async create(userId: number, dto: CreateDeliveryDto, type: DeliveryType): Promise<Delivery> {
    const delivery = this.deliveryRepository.create({
      userId,
      ...dto,
      type,
      status: DeliveryStatus.PENDING,
    });
    return await this.deliveryRepository.save(delivery);
  }

  async findAll(userId: number, type?: DeliveryType): Promise<Delivery[]> {
    const query = this.deliveryRepository.createQueryBuilder('delivery')
      .where('delivery.userId = :userId', { userId })
      .orderBy('delivery.createdAt', 'DESC');

    if (type) {
      query.andWhere('delivery.type = :type', { type });
    }

    return await query.getMany();
  }

  async findPendingDeliveries(): Promise<Delivery[]> {
    return await this.deliveryRepository.find({
      where: { status: DeliveryStatus.PENDING },
      order: { createdAt: 'ASC' }
    });
  }

  // Admin: Get ALL deliveries from ALL users
  async findAllForAdmin(filters?: { type?: DeliveryType; status?: DeliveryStatus }): Promise<Delivery[]> {
    const query = this.deliveryRepository.createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.user', 'user')
      .leftJoinAndSelect('delivery.multiDropLocations', 'multiDropLocations')
      .orderBy('delivery.createdAt', 'DESC');

    if (filters?.type) {
      query.andWhere('delivery.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      query.andWhere('delivery.status = :status', { status: filters.status });
    }

    return await query.getMany();
  }

  // Admin: Get delivery statistics
  async getDeliveryStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalCount,
      activeCount,
      completedTodayCount,
      totalRevenue,
      todayRevenue,
      byType,
      byStatus
    ] = await Promise.all([
      // Total deliveries
      this.deliveryRepository.count(),
      
      // Active deliveries (pending, accepted, picked_up, in_transit)
      this.deliveryRepository.count({
        where: [
          { status: DeliveryStatus.PENDING },
          { status: DeliveryStatus.ACCEPTED },
          { status: DeliveryStatus.PICKED_UP },
          { status: DeliveryStatus.IN_TRANSIT }
        ]
      }),
      
      // Completed today
      this.deliveryRepository.count({
        where: {
          status: DeliveryStatus.DELIVERED,
          updatedAt: todayStart as any
        }
      }),
      
      // Total revenue
      this.deliveryRepository
        .createQueryBuilder('delivery')
        .select('SUM(delivery.price)', 'total')
        .where('delivery.status = :status', { status: DeliveryStatus.DELIVERED })
        .getRawOne(),
      
      // Today's revenue
      this.deliveryRepository
        .createQueryBuilder('delivery')
        .select('SUM(delivery.price)', 'total')
        .where('delivery.status = :status', { status: DeliveryStatus.DELIVERED })
        .andWhere('delivery.updatedAt >= :todayStart', { todayStart })
        .getRawOne(),
      
      // Count by type
      this.deliveryRepository
        .createQueryBuilder('delivery')
        .select('delivery.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('delivery.type')
        .getRawMany(),
      
      // Count by status
      this.deliveryRepository
        .createQueryBuilder('delivery')
        .select('delivery.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('delivery.status')
        .getRawMany()
    ]);

    return {
      total: totalCount,
      active: activeCount,
      completedToday: completedTodayCount,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
      todayRevenue: parseFloat(todayRevenue?.total || '0'),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {})
    };
  }

  async findOne(userId: number, id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id, userId }
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  async findOneById(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id }
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  async assignDriver(id: number, driverId: number): Promise<Delivery> {
    const delivery = await this.findOneById(id);
    
    if (delivery.status !== DeliveryStatus.PENDING) {
      throw new BadRequestException('Can only assign driver to pending deliveries');
    }

    delivery.driverId = driverId;
    delivery.status = DeliveryStatus.ACCEPTED;
    
    return await this.deliveryRepository.save(delivery);
  }

  async updateStatus(id: number, status: DeliveryStatus): Promise<Delivery> {
    const delivery = await this.findOneById(id);
    
    // Validate status transition
    this.validateStatusTransition(delivery.status, status);
    
    delivery.status = status;
    
    // Set estimated arrival when status changes to in_transit
    if (status === DeliveryStatus.IN_TRANSIT) {
      delivery.estimatedArrival = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    }
    
    // Set actual arrival when delivered
    if (status === DeliveryStatus.DELIVERED) {
      delivery.actualArrival = new Date();
    }
    
    return await this.deliveryRepository.save(delivery);
  }

  // Calculate price for multi-drop
  calculateMultiDropPrice(dropLocations: DropLocationDto[]): number {
    const basePrice = 15000; // Base price
    const pricePerDrop = 5000; // Additional per drop point
    const pricePerKm = 2000; // Per km

    // Calculate total distance (simplified - in production use Google Maps API)
    const estimatedTotalKm = dropLocations.length * 5; // Rough estimate

    const totalPrice = basePrice + 
                      (dropLocations.length - 1) * pricePerDrop + 
                      estimatedTotalKm * pricePerKm;

    return totalPrice;
  }

  // Calculate price for paket besar
  calculatePaketBesarPrice(packageDetails: CreatePaketBesarDto, distance: number): number {
    const { weight, length, width, height, requiresHelper, isFragile } = packageDetails;

    // Calculate volume weight: (L x W x H) / 5000
    const volumeWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(weight, volumeWeight);

    let basePrice = 20000; // Base untuk paket besar
    const pricePerKg = 3000;
    const pricePerKm = 2500;

    let totalPrice = basePrice + 
                    (chargeableWeight * pricePerKg) + 
                    (distance * pricePerKm);

    // Additional charges
    if (requiresHelper) totalPrice += 25000; // Helper fee
    if (isFragile) totalPrice += 10000; // Handling fragile items

    return totalPrice;
  }

  // Helper to calculate distance (simplified - use Google Maps API in production)
  private calculateDistance(pickup: string, dropoff: string): number {
    // Simplified: return random distance between 5-50 km
    return Math.floor(Math.random() * 45) + 5;
  }

  // Create multi-drop delivery
  async createMultiDropDelivery(
    userId: number, 
    createDto: CreateMultiDropDeliveryDto
  ): Promise<Delivery> {
    const price = this.calculateMultiDropPrice(createDto.dropLocations);

    const delivery = this.deliveryRepository.create({
      userId,
      type: DeliveryType.MULTI_DROP,
      pickupLocation: createDto.pickupLocation,
      dropoffLocation: `Multi-Drop (${createDto.dropLocations.length} locations)`,
      price,
      totalDropPoints: createDto.dropLocations.length,
      totalDistance: createDto.estimatedDistance,
      notes: createDto.notes,
    });

    const savedDelivery = await this.deliveryRepository.save(delivery);

    // Save drop locations
    const locations = createDto.dropLocations.map(loc => 
      this.multiDropLocationRepository.create({
        ...loc,
        deliveryId: savedDelivery.id,
      })
    );

    await this.multiDropLocationRepository.save(locations);

    const result = await this.deliveryRepository.findOne({
      where: { id: savedDelivery.id },
      relations: ['multiDropLocations'],
    });

    if (!result) {
      throw new NotFoundException('Delivery not found after creation');
    }

    return result;
  }

  // Create scheduled delivery
  async createScheduledDelivery(
    userId: number,
    createDto: CreateScheduledDeliveryDto
  ): Promise<Delivery> {
    // Simple price calculation (in production, use zone-based pricing)
    const distance = this.calculateDistance(createDto.pickupLocation, createDto.dropoffLocation);
    const basePrice = 10000;
    const pricePerKm = 2000;
    const price = basePrice + (distance * pricePerKm);

    const delivery = this.deliveryRepository.create({
      userId,
      type: DeliveryType.JADWAL,
      pickupLocation: createDto.pickupLocation,
      dropoffLocation: createDto.dropoffLocation,
      scheduledDate: new Date(createDto.scheduledDate),
      scheduleTimeSlot: createDto.scheduleTimeSlot,
      barang: createDto.barang,
      price,
      notes: createDto.notes,
    });

    return this.deliveryRepository.save(delivery);
  }

  // Create paket besar delivery
  async createPaketBesarDelivery(
    userId: number,
    createDto: CreatePaketBesarDto
  ): Promise<Delivery> {
    const distance = this.calculateDistance(
      createDto.pickupLocation,
      createDto.dropoffLocation
    );

    const price = this.calculatePaketBesarPrice(createDto, distance);

    const delivery = this.deliveryRepository.create({
      userId,
      type: DeliveryType.PAKET_BESAR,
      pickupLocation: createDto.pickupLocation,
      dropoffLocation: createDto.dropoffLocation,
      price,
      packageDetails: {
        weight: createDto.weight,
        length: createDto.length,
        width: createDto.width,
        height: createDto.height,
        volumeWeight: (createDto.length * createDto.width * createDto.height) / 5000,
        category: createDto.category,
        isFragile: createDto.isFragile,
        requiresHelper: createDto.requiresHelper,
      },
      scheduledDate: createDto.scheduledDate ? new Date(createDto.scheduledDate) : undefined,
      scheduleTimeSlot: createDto.scheduleTimeSlot || undefined,
      notes: createDto.notes,
    });

    return this.deliveryRepository.save(delivery);
  }

  // Get multi-drop locations for a delivery
  async getMultiDropLocations(deliveryId: number): Promise<MultiDropLocation[]> {
    return this.multiDropLocationRepository.find({
      where: { deliveryId },
      order: { sequence: 'ASC' },
    });
  }

  private validateStatusTransition(currentStatus: DeliveryStatus, newStatus: DeliveryStatus): void {
    const validTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
      [DeliveryStatus.PENDING]: [DeliveryStatus.ACCEPTED, DeliveryStatus.CANCELLED],
      [DeliveryStatus.ACCEPTED]: [DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED],
      [DeliveryStatus.PICKED_UP]: [DeliveryStatus.IN_TRANSIT, DeliveryStatus.CANCELLED],
      [DeliveryStatus.IN_TRANSIT]: [DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED],
      [DeliveryStatus.DELIVERED]: [],
      [DeliveryStatus.CANCELLED]: []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }

  async cancelDelivery(id: number, userId: number): Promise<Delivery> {
    return await this.updateStatus(id, DeliveryStatus.CANCELLED);
  }
}
