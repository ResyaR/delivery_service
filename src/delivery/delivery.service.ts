import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { Delivery, DeliveryStatus } from './delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
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
