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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const shipping_manager_service_1 = require("../shipping-managers/shipping-manager.service");
let OrderController = class OrderController {
    constructor(orderService, shippingManagerService) {
        this.orderService = orderService;
        this.shippingManagerService = shippingManagerService;
        this.ADMIN_KEY = 'resya123@';
    }
    validateAdminKey(adminKey) {
        if (adminKey !== this.ADMIN_KEY) {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
    }
    async create(req, createOrderDto) {
        const order = await this.orderService.create(req.user.id, createOrderDto);
        return {
            message: 'Order created successfully',
            data: order,
        };
    }
    async findAll(adminKey, userId, status) {
        this.validateAdminKey(adminKey);
        const orders = await this.orderService.findAll(userId ? +userId : undefined, status);
        return {
            message: 'Orders retrieved successfully',
            data: orders,
        };
    }
    async getMyOrders(req) {
        const orders = await this.orderService.getUserOrders(req.user.id);
        return {
            message: 'Orders retrieved successfully',
            data: orders,
        };
    }
    async getRestaurantOrders(adminKey, restaurantId) {
        this.validateAdminKey(adminKey);
        const orders = await this.orderService.getRestaurantOrders(+restaurantId);
        return {
            message: 'Orders retrieved successfully',
            data: orders,
        };
    }
    async findOne(id) {
        const order = await this.orderService.findOne(+id);
        return {
            message: 'Order retrieved successfully',
            data: order,
        };
    }
    async updateStatus(adminKey, id, updateStatusDto) {
        this.validateAdminKey(adminKey);
        const order = await this.orderService.updateStatus(+id, updateStatusDto.status);
        return {
            message: 'Order status updated successfully',
            data: order,
        };
    }
    async getOrdersByZone(token, zone, status) {
        try {
            const manager = await this.shippingManagerService.findByToken(token);
            if (manager.zone !== parseInt(zone)) {
                throw new common_1.UnauthorizedException('You can only access orders from your assigned zone');
            }
            const orders = await this.orderService.findByZone(parseInt(zone), status);
            return {
                message: 'Orders retrieved successfully',
                data: orders,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid shipping manager token');
        }
    }
    async getMyShippingManagerOrders(token, status) {
        try {
            const manager = await this.shippingManagerService.findByToken(token);
            const orders = await this.orderService.findByShippingManager(manager.id, status);
            return {
                message: 'Orders retrieved successfully',
                data: orders,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid shipping manager token');
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create food order (User authenticated)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user orders (User authenticated)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get restaurant orders (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getRestaurantOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('shipping-manager/zone/:zone'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders by zone (Shipping Manager)' }),
    (0, swagger_1.ApiHeader)({ name: 'shipping-manager-token', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('shipping-manager-token')),
    __param(1, (0, common_1.Param)('zone')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByZone", null);
__decorate([
    (0, common_1.Get)('shipping-manager/my-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders assigned to shipping manager' }),
    (0, swagger_1.ApiHeader)({ name: 'shipping-manager-token', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('shipping-manager-token')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getMyShippingManagerOrders", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        shipping_manager_service_1.ShippingManagerService])
], OrderController);
//# sourceMappingURL=order.controller.js.map