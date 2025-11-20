import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, CreateTitipBeliDto } from './dto/create-delivery.dto';
import { DeliveryListResponseDto, DeliveryDetailResponseDto, DeliveryCreateResponseDto } from './dto/delivery-response.dto';
import { DeliveryType } from './dto/delivery-type.enum';
import { DeliveryStatus } from './delivery.entity';
import { CreateMultiDropDeliveryDto } from './dto/create-multi-drop.dto';
import { CreateScheduledDeliveryDto } from './dto/create-scheduled-delivery.dto';
import { CreatePaketBesarDto } from './dto/create-paket-besar.dto';
import { ShippingManagerService } from '../shipping-managers/shipping-manager.service';
export declare class DeliveryController {
    private readonly deliveryService;
    private readonly shippingManagerService;
    constructor(deliveryService: DeliveryService, shippingManagerService: ShippingManagerService);
    createKirimSekarang(req: any, dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createJadwal(req: any, dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createTitipBeli(req: any, dto: CreateTitipBeliDto): Promise<DeliveryCreateResponseDto>;
    createMultiDrop(req: any, createDto: CreateMultiDropDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createScheduled(req: any, createDto: CreateScheduledDeliveryDto): Promise<DeliveryCreateResponseDto>;
    createPaketBesar(req: any, createDto: CreatePaketBesarDto): Promise<DeliveryCreateResponseDto>;
    getDropLocations(id: number): Promise<{
        message: string;
        data: import("./multi-drop-location.entity").MultiDropLocation[];
    }>;
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
    getDeliveriesByZone(token: string, zone: string, status?: DeliveryStatus): Promise<{
        message: string;
        data: import("./delivery.entity").Delivery[];
    }>;
    getMyDeliveries(token: string, status?: DeliveryStatus): Promise<{
        message: string;
        data: import("./delivery.entity").Delivery[];
    }>;
    updateStatusByShippingManager(token: string, id: string, body: {
        status: DeliveryStatus;
    }): Promise<{
        message: string;
        data: import("./delivery.entity").Delivery;
    }>;
    trackDelivery(resiCode: string): Promise<{
        message: string;
        data: import("./delivery.entity").Delivery;
    }>;
}
