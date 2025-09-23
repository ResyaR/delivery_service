import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, CreateTitipBeliDto } from './dto/create-delivery.dto';
import { DeliveryListResponseDto, DeliveryDetailResponseDto, DeliveryCreateResponseDto } from './dto/delivery-response.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { DeliveryStatus } from './delivery.entity';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    createKirimSekarang(req: any, dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createJadwal(req: any, dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createTitipBeli(req: any, dto: CreateTitipBeliDto): Promise<DeliveryCreateResponseDto>;
    getHistory(req: any, type?: DeliveryType): Promise<DeliveryListResponseDto>;
    getPendingDeliveries(): Promise<DeliveryListResponseDto>;
    getStatus(req: any, id: number): Promise<DeliveryDetailResponseDto>;
    assignDriver(id: number, body: {
        driverId: number;
    }): Promise<DeliveryDetailResponseDto>;
    updateStatus(id: number, body: {
        status: DeliveryStatus;
    }): Promise<DeliveryDetailResponseDto>;
    cancelDelivery(req: any, id: number): Promise<DeliveryDetailResponseDto>;
}
