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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const restaurant_service_1 = require("../restaurants/restaurant.service");
const shipping_manager_service_1 = require("../shipping-managers/shipping-manager.service");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, restaurantService, shippingManagerService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.restaurantService = restaurantService;
        this.shippingManagerService = shippingManagerService;
    }
    async create(userId, createOrderDto) {
        await this.restaurantService.findOne(createOrderDto.restaurantId);
        const subtotal = createOrderDto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let deliveryFee = createOrderDto.deliveryFee || 10000;
        if (createOrderDto.deliveryType === order_entity_1.DeliveryType.EXPRESS) {
            deliveryFee = deliveryFee * 1.5;
        }
        const total = subtotal + deliveryFee;
        let shippingManagerId = null;
        try {
            const shippingManagers = await this.shippingManagerService.findByZone(createOrderDto.deliveryZone);
            if (shippingManagers.length > 0) {
                shippingManagerId = shippingManagers[0].id;
            }
        }
        catch (error) {
            console.warn(`No shipping manager found for zone ${createOrderDto.deliveryZone}`);
        }
        let orderNumber = '';
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        const generateRandomCode = (length) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        while (!isUnique && attempts < maxAttempts) {
            const randomCode = generateRandomCode(6);
            orderNumber = `MT-${randomCode}`;
            const existing = await this.orderRepository.findOne({
                where: { orderNumber },
            });
            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique || !orderNumber) {
            const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
            orderNumber = `MT-${timestamp}`;
        }
        const order = this.orderRepository.create({
            userId,
            restaurantId: createOrderDto.restaurantId,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress: createOrderDto.deliveryAddress,
            deliveryCity: createOrderDto.deliveryCity,
            deliveryProvince: createOrderDto.deliveryProvince,
            deliveryPostalCode: createOrderDto.deliveryPostalCode,
            deliveryZone: createOrderDto.deliveryZone,
            deliveryType: createOrderDto.deliveryType || order_entity_1.DeliveryType.REGULAR,
            scheduledDate: createOrderDto.scheduledDate ? new Date(createOrderDto.scheduledDate) : undefined,
            scheduledTime: createOrderDto.scheduledTime || undefined,
            scheduleTimeSlot: createOrderDto.scheduleTimeSlot || undefined,
            shippingManagerId: shippingManagerId || undefined,
            notes: createOrderDto.notes,
            customerName: createOrderDto.customerName,
            customerPhone: createOrderDto.customerPhone,
            orderNumber: orderNumber,
            status: 'pending',
        });
        const savedOrder = await this.orderRepository.save(order);
        const orderItems = createOrderDto.items.map(item => this.orderItemRepository.create({
            orderId: savedOrder.id,
            menuId: item.menuId,
            menuName: item.menuName,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
        }));
        await this.orderItemRepository.save(orderItems);
        await this.restaurantService.incrementOrderCount(createOrderDto.restaurantId);
        return await this.findOne(savedOrder.id);
    }
    async findAll(userId, status) {
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
    async findByZone(zone, status) {
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
        if (orders.length > 0) {
            console.log(`[OrderService] First order: ID=${orders[0].id}, Zone=${orders[0].deliveryZone}, Status=${orders[0].status}`);
        }
        else {
            const allOrders = await this.orderRepository.find({ where: { deliveryZone: zone } });
            console.log(`[OrderService] Debug: Total orders with zone ${zone} in DB: ${allOrders.length}`);
        }
        return orders;
    }
    async findByShippingManager(shippingManagerId, status) {
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
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'restaurant', 'user', 'shippingManager'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        order.status = status;
        await this.orderRepository.save(order);
        return await this.findOne(id);
    }
    async getUserOrders(userId) {
        return await this.findAll(userId);
    }
    async getRestaurantOrders(restaurantId) {
        return await this.orderRepository.find({
            where: { restaurantId },
            relations: ['items', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async calculateRevenue() {
        const result = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.status IN (:...statuses)', { statuses: ['delivered', 'delivering', 'preparing'] })
            .getRawOne();
        return result?.total || 0;
    }
    async getTotalOrders() {
        return await this.orderRepository.count();
    }
    async findByOrderNumber(userId, orderNumber) {
        let normalizedOrderNumber = orderNumber.trim().toUpperCase();
        if (!normalizedOrderNumber.startsWith('MT-')) {
            normalizedOrderNumber = `MT-${normalizedOrderNumber}`;
        }
        if (!normalizedOrderNumber.match(/^MT-[A-Z0-9]{6}$/)) {
            throw new common_1.NotFoundException('Nomor resi tidak valid. Format: MT-XXXXXX (6 karakter huruf/angka)');
        }
        const order = await this.orderRepository.findOne({
            where: { orderNumber: normalizedOrderNumber },
            relations: ['items', 'restaurant', 'user', 'shippingManager'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
        }
        if (order.userId !== userId) {
            throw new common_1.NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
        }
        return order;
    }
    async findByOrderNumberPublic(orderNumber) {
        let normalizedOrderNumber = orderNumber.trim().toUpperCase();
        if (!normalizedOrderNumber.startsWith('MT-')) {
            normalizedOrderNumber = `MT-${normalizedOrderNumber}`;
        }
        if (!normalizedOrderNumber.match(/^MT-[A-Z0-9]{6}$/)) {
            throw new common_1.NotFoundException('Nomor resi tidak valid. Format: MT-XXXXXX (6 karakter huruf/angka)');
        }
        const order = await this.orderRepository.findOne({
            where: { orderNumber: normalizedOrderNumber },
            relations: ['items', 'restaurant', 'user', 'shippingManager'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Resi ${normalizedOrderNumber} tidak ditemukan`);
        }
        return order;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        restaurant_service_1.RestaurantService,
        shipping_manager_service_1.ShippingManagerService])
], OrderService);
//# sourceMappingURL=order.service.js.map