import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { Delivery, DeliveryStatus } from './delivery.entity';
export declare class DeliveryService {
    private deliveryRepository;
    constructor(deliveryRepository: Repository<Delivery>);
    create(userId: number, dto: CreateDeliveryDto, type: DeliveryType): Promise<Delivery>;
    findAll(userId: number, type?: DeliveryType): Promise<Delivery[]>;
    findPendingDeliveries(): Promise<Delivery[]>;
    findOne(userId: number, id: number): Promise<Delivery>;
    findOneById(id: number): Promise<Delivery>;
    assignDriver(id: number, driverId: number): Promise<Delivery>;
    updateStatus(id: number, status: DeliveryStatus): Promise<Delivery>;
    private validateStatusTransition;
    cancelDelivery(id: number, userId: number): Promise<Delivery>;
}
