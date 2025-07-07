import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryType } from './dto/delivery-type.enum';

@Injectable()
export class DeliveryService {
  private deliveries: any[] = [];

  create(userId: number, dto: CreateDeliveryDto, type: DeliveryType) {
    const delivery = {
      id: this.deliveries.length + 1,
      userId,
      ...dto,
      type,
      status: 'pending',
      createdAt: new Date(),
    };
    this.deliveries.push(delivery);
    return delivery;
  }

  findAll(userId: number, type?: DeliveryType) {
    return this.deliveries.filter(d => d.userId === userId && (!type || d.type === type));
  }

  findOne(userId: number, id: number) {
    return this.deliveries.find(d => d.userId === userId && d.id === id);
  }
}
