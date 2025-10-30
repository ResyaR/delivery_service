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
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, restaurantService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.restaurantService = restaurantService;
    }
    async create(userId, createOrderDto) {
        await this.restaurantService.findOne(createOrderDto.restaurantId);
        const subtotal = createOrderDto.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = createOrderDto.deliveryFee || 10000;
        const total = subtotal + deliveryFee;
        const order = this.orderRepository.create({
            userId,
            restaurantId: createOrderDto.restaurantId,
            subtotal,
            deliveryFee,
            total,
            deliveryAddress: createOrderDto.deliveryAddress,
            notes: createOrderDto.notes,
            customerName: createOrderDto.customerName,
            customerPhone: createOrderDto.customerPhone,
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
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'restaurant', 'user'],
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        restaurant_service_1.RestaurantService])
], OrderService);
//# sourceMappingURL=order.service.js.map