import { UserService } from '../users/user.service';
import { DeliveryService } from '../delivery/delivery.service';
import { DeliveryType } from '../delivery/dto/delivery-type.enum';
import { DeliveryStatus } from '../delivery/delivery.entity';
export declare class AdminController {
    private readonly userService;
    private readonly deliveryService;
    constructor(userService: UserService, deliveryService: DeliveryService);
    deleteAllUsers(adminKey: string): Promise<{
        message: string;
    }>;
    getAllDeliveries(adminKey: string, type?: DeliveryType, status?: DeliveryStatus): Promise<{
        message: string;
        data: import("../delivery/delivery.entity").Delivery[];
    }>;
    getDeliveryStats(adminKey: string): Promise<{
        message: string;
        data: {
            total: number;
            active: number;
            completedToday: number;
            totalRevenue: number;
            todayRevenue: number;
            byType: any;
            byStatus: any;
        };
    }>;
    getDeliveryDetail(adminKey: string, id: number): Promise<{
        message: string;
        data: {
            dropLocations: any[];
            id: number;
            userId: number;
            user: import("../users/user.entity").User;
            pickupLocation: string;
            dropoffLocation: string;
            barang?: {
                itemName: string;
                scale: string;
            };
            titipDeskripsi?: string;
            jadwal?: Date;
            price: number;
            type: DeliveryType;
            status: DeliveryStatus;
            driverId?: number;
            estimatedArrival?: Date;
            actualArrival?: Date;
            notes?: string;
            multiDropLocations?: import("../delivery/multi-drop-location.entity").MultiDropLocation[];
            packageDetails?: {
                weight: number;
                length: number;
                width: number;
                height: number;
                volumeWeight?: number;
                category?: string;
                isFragile?: boolean;
                requiresHelper?: boolean;
            };
            scheduledDate?: Date;
            scheduledTime?: string;
            scheduleTimeSlot?: string;
            deliveryZone?: number;
            shippingManagerId?: number;
            totalDropPoints?: number;
            totalDistance?: number;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateDeliveryStatus(adminKey: string, id: number, body: {
        status: DeliveryStatus;
    }): Promise<{
        message: string;
        data: import("../delivery/delivery.entity").Delivery;
    }>;
    assignDriverToDelivery(adminKey: string, id: number, body: {
        driverId: number;
    }): Promise<{
        message: string;
        data: import("../delivery/delivery.entity").Delivery;
    }>;
}
