"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_type_enum_1 = require("./dto/delivery-type.enum");
const delivery_entity_1 = require("./delivery.entity");
const multi_drop_location_entity_1 = require("./multi-drop-location.entity");
let DeliveryService = class DeliveryService {
    constructor(deliveryRepository, multiDropLocationRepository) {
        this.deliveryRepository = deliveryRepository;
        this.multiDropLocationRepository = multiDropLocationRepository;
    }
    async create(userId, dto, type) {
        const delivery = this.deliveryRepository.create({
            userId,
            ...dto,
            type,
            status: delivery_entity_1.DeliveryStatus.PENDING,
        });
        return await this.deliveryRepository.save(delivery);
    }
    async findAll(userId, type) {
        const query = this.deliveryRepository.createQueryBuilder('delivery')
            .where('delivery.userId = :userId', { userId })
            .orderBy('delivery.createdAt', 'DESC');
        if (type) {
            query.andWhere('delivery.type = :type', { type });
        }
        return await query.getMany();
    }
    async findPendingDeliveries() {
        return await this.deliveryRepository.find({
            where: { status: delivery_entity_1.DeliveryStatus.PENDING },
            order: { createdAt: 'ASC' }
        });
    }
    async findAllForAdmin(filters) {
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
    async getDeliveryStats() {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const [totalCount, activeCount, completedTodayCount, totalRevenue, todayRevenue, byType, byStatus] = await Promise.all([
            this.deliveryRepository.count(),
            this.deliveryRepository.count({
                where: [
                    { status: delivery_entity_1.DeliveryStatus.PENDING },
                    { status: delivery_entity_1.DeliveryStatus.ACCEPTED },
                    { status: delivery_entity_1.DeliveryStatus.PICKED_UP },
                    { status: delivery_entity_1.DeliveryStatus.IN_TRANSIT }
                ]
            }),
            this.deliveryRepository.count({
                where: {
                    status: delivery_entity_1.DeliveryStatus.DELIVERED,
                    updatedAt: todayStart
                }
            }),
            this.deliveryRepository
                .createQueryBuilder('delivery')
                .select('SUM(delivery.price)', 'total')
                .where('delivery.status = :status', { status: delivery_entity_1.DeliveryStatus.DELIVERED })
                .getRawOne(),
            this.deliveryRepository
                .createQueryBuilder('delivery')
                .select('SUM(delivery.price)', 'total')
                .where('delivery.status = :status', { status: delivery_entity_1.DeliveryStatus.DELIVERED })
                .andWhere('delivery.updatedAt >= :todayStart', { todayStart })
                .getRawOne(),
            this.deliveryRepository
                .createQueryBuilder('delivery')
                .select('delivery.type', 'type')
                .addSelect('COUNT(*)', 'count')
                .groupBy('delivery.type')
                .getRawMany(),
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
    async findOne(userId, id) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id, userId }
        });
        if (!delivery) {
            throw new common_1.NotFoundException(`Delivery with ID ${id} not found`);
        }
        return delivery;
    }
    async findOneById(id) {
        const delivery = await this.deliveryRepository.findOne({
            where: { id }
        });
        if (!delivery) {
            throw new common_1.NotFoundException(`Delivery with ID ${id} not found`);
        }
        return delivery;
    }
    async assignDriver(id, driverId) {
        const delivery = await this.findOneById(id);
        if (delivery.status !== delivery_entity_1.DeliveryStatus.PENDING) {
            throw new common_1.BadRequestException('Can only assign driver to pending deliveries');
        }
        delivery.driverId = driverId;
        delivery.status = delivery_entity_1.DeliveryStatus.ACCEPTED;
        return await this.deliveryRepository.save(delivery);
    }
    async updateStatus(id, status) {
        const delivery = await this.findOneById(id);
        this.validateStatusTransition(delivery.status, status);
        delivery.status = status;
        if (status === delivery_entity_1.DeliveryStatus.IN_TRANSIT) {
            delivery.estimatedArrival = new Date(Date.now() + 30 * 60 * 1000);
        }
        if (status === delivery_entity_1.DeliveryStatus.DELIVERED) {
            delivery.actualArrival = new Date();
        }
        return await this.deliveryRepository.save(delivery);
    }
    calculateMultiDropPrice(dropLocations) {
        const basePrice = 15000;
        const pricePerDrop = 5000;
        const pricePerKm = 2000;
        const estimatedTotalKm = dropLocations.length * 5;
        const totalPrice = basePrice +
            (dropLocations.length - 1) * pricePerDrop +
            estimatedTotalKm * pricePerKm;
        return totalPrice;
    }
    calculatePaketBesarPrice(packageDetails, distance) {
        const { weight, length, width, height, requiresHelper, isFragile } = packageDetails;
        const volumeWeight = (length * width * height) / 5000;
        const chargeableWeight = Math.max(weight, volumeWeight);
        let basePrice = 20000;
        const pricePerKg = 3000;
        const pricePerKm = 2500;
        let totalPrice = basePrice +
            (chargeableWeight * pricePerKg) +
            (distance * pricePerKm);
        if (requiresHelper)
            totalPrice += 25000;
        if (isFragile)
            totalPrice += 10000;
        return totalPrice;
    }
    calculateDistance(pickup, dropoff) {
        return Math.floor(Math.random() * 45) + 5;
    }
    async createMultiDropDelivery(userId, createDto) {
        const price = this.calculateMultiDropPrice(createDto.dropLocations);
        const delivery = this.deliveryRepository.create({
            userId,
            type: delivery_type_enum_1.DeliveryType.MULTI_DROP,
            pickupLocation: createDto.pickupLocation,
            dropoffLocation: `Multi-Drop (${createDto.dropLocations.length} locations)`,
            price,
            totalDropPoints: createDto.dropLocations.length,
            totalDistance: createDto.estimatedDistance,
            notes: createDto.notes,
        });
        const savedDelivery = await this.deliveryRepository.save(delivery);
        const locations = createDto.dropLocations.map(loc => this.multiDropLocationRepository.create({
            ...loc,
            deliveryId: savedDelivery.id,
        }));
        await this.multiDropLocationRepository.save(locations);
        const result = await this.deliveryRepository.findOne({
            where: { id: savedDelivery.id },
            relations: ['multiDropLocations'],
        });
        if (!result) {
            throw new common_1.NotFoundException('Delivery not found after creation');
        }
        return result;
    }
    async createScheduledDelivery(userId, createDto) {
        const distance = this.calculateDistance(createDto.pickupLocation, createDto.dropoffLocation);
        const basePrice = 10000;
        const pricePerKm = 2000;
        const price = basePrice + (distance * pricePerKm);
        const delivery = this.deliveryRepository.create({
            userId,
            type: delivery_type_enum_1.DeliveryType.JADWAL,
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
    async createPaketBesarDelivery(userId, createDto) {
        const distance = this.calculateDistance(createDto.pickupLocation, createDto.dropoffLocation);
        const price = this.calculatePaketBesarPrice(createDto, distance);
        const delivery = this.deliveryRepository.create({
            userId,
            type: delivery_type_enum_1.DeliveryType.PAKET_BESAR,
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
    async getMultiDropLocations(deliveryId) {
        return this.multiDropLocationRepository.find({
            where: { deliveryId },
            order: { sequence: 'ASC' },
        });
    }
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [delivery_entity_1.DeliveryStatus.PENDING]: [delivery_entity_1.DeliveryStatus.ACCEPTED, delivery_entity_1.DeliveryStatus.CANCELLED],
            [delivery_entity_1.DeliveryStatus.ACCEPTED]: [delivery_entity_1.DeliveryStatus.PICKED_UP, delivery_entity_1.DeliveryStatus.CANCELLED],
            [delivery_entity_1.DeliveryStatus.PICKED_UP]: [delivery_entity_1.DeliveryStatus.IN_TRANSIT, delivery_entity_1.DeliveryStatus.CANCELLED],
            [delivery_entity_1.DeliveryStatus.IN_TRANSIT]: [delivery_entity_1.DeliveryStatus.DELIVERED, delivery_entity_1.DeliveryStatus.CANCELLED],
            [delivery_entity_1.DeliveryStatus.DELIVERED]: [],
            [delivery_entity_1.DeliveryStatus.CANCELLED]: []
        };
        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }
    }
    async cancelDelivery(id, userId) {
        return await this.updateStatus(id, delivery_entity_1.DeliveryStatus.CANCELLED);
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __param(1, (0, typeorm_1.InjectRepository)(multi_drop_location_entity_1.MultiDropLocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map