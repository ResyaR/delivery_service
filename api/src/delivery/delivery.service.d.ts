import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { Delivery, DeliveryStatus } from './delivery.entity';
import { MultiDropLocation } from './multi-drop-location.entity';
import { CreateMultiDropDeliveryDto, DropLocationDto } from './dto/create-multi-drop.dto';
import { CreateScheduledDeliveryDto } from './dto/create-scheduled-delivery.dto';
import { CreatePaketBesarDto } from './dto/create-paket-besar.dto';
export declare class DeliveryService {
    private deliveryRepository;
    private multiDropLocationRepository;
    constructor(deliveryRepository: Repository<Delivery>, multiDropLocationRepository: Repository<MultiDropLocation>);
    create(userId: number, dto: CreateDeliveryDto, type: DeliveryType): Promise<Delivery>;
    findAll(userId: number, type?: DeliveryType): Promise<Delivery[]>;
    findPendingDeliveries(): Promise<Delivery[]>;
    findAllForAdmin(filters?: {
        type?: DeliveryType;
        status?: DeliveryStatus;
    }): Promise<Delivery[]>;
    getDeliveryStats(): Promise<{
        total: number;
        active: number;
        completedToday: number;
        totalRevenue: number;
        todayRevenue: number;
        byType: any;
        byStatus: any;
    }>;
    findOne(userId: number, id: number): Promise<Delivery>;
    findOneById(id: number): Promise<Delivery>;
    assignDriver(id: number, driverId: number): Promise<Delivery>;
    updateStatus(id: number, status: DeliveryStatus): Promise<Delivery>;
    calculateMultiDropPrice(dropLocations: DropLocationDto[]): number;
    calculatePaketBesarPrice(packageDetails: CreatePaketBesarDto, distance: number): number;
    private calculateDistance;
    createMultiDropDelivery(userId: number, createDto: CreateMultiDropDeliveryDto): Promise<Delivery>;
    createScheduledDelivery(userId: number, createDto: CreateScheduledDeliveryDto): Promise<Delivery>;
    createPaketBesarDelivery(userId: number, createDto: CreatePaketBesarDto): Promise<Delivery>;
    getMultiDropLocations(deliveryId: number): Promise<MultiDropLocation[]>;
    private validateStatusTransition;
    cancelDelivery(id: number, userId: number): Promise<Delivery>;
}
