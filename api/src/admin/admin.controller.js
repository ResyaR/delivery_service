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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../users/user.service");
const delivery_service_1 = require("../delivery/delivery.service");
const delivery_type_enum_1 = require("../delivery/dto/delivery-type.enum");
const delivery_entity_1 = require("../delivery/delivery.entity");
let AdminController = class AdminController {
    constructor(userService, deliveryService) {
        this.userService = userService;
        this.deliveryService = deliveryService;
    }
    async deleteAllUsers(adminKey) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            await this.userService.deleteAllUsers();
            return { message: 'All users deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting users:', error);
            throw new common_1.InternalServerErrorException('Failed to delete users: ' + error.message);
        }
    }
    async getAllDeliveries(adminKey, type, status) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            const filters = {};
            if (type)
                filters['type'] = type;
            if (status)
                filters['status'] = status;
            const deliveries = await this.deliveryService.findAllForAdmin(filters);
            return {
                message: 'Deliveries fetched successfully',
                data: deliveries
            };
        }
        catch (error) {
            console.error('Error fetching deliveries:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch deliveries: ' + error.message);
        }
    }
    async getDeliveryStats(adminKey) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            const stats = await this.deliveryService.getDeliveryStats();
            return {
                message: 'Stats fetched successfully',
                data: stats
            };
        }
        catch (error) {
            console.error('Error fetching stats:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch stats: ' + error.message);
        }
    }
    async getDeliveryDetail(adminKey, id) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            const delivery = await this.deliveryService.findOneById(Number(id));
            let dropLocations = [];
            if (delivery.type === delivery_type_enum_1.DeliveryType.MULTI_DROP) {
                dropLocations = await this.deliveryService.getMultiDropLocations(delivery.id);
            }
            return {
                message: 'Delivery detail fetched successfully',
                data: {
                    ...delivery,
                    dropLocations
                }
            };
        }
        catch (error) {
            console.error('Error fetching delivery detail:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch delivery detail: ' + error.message);
        }
    }
    async updateDeliveryStatus(adminKey, id, body) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            const delivery = await this.deliveryService.updateStatus(Number(id), body.status);
            return {
                message: 'Status updated successfully',
                data: delivery
            };
        }
        catch (error) {
            console.error('Error updating status:', error);
            throw new common_1.InternalServerErrorException('Failed to update status: ' + error.message);
        }
    }
    async assignDriverToDelivery(adminKey, id, body) {
        if (adminKey !== 'resya123@') {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
        try {
            const delivery = await this.deliveryService.assignDriver(Number(id), body.driverId);
            return {
                message: 'Driver assigned successfully',
                data: delivery
            };
        }
        catch (error) {
            console.error('Error assigning driver:', error);
            throw new common_1.InternalServerErrorException('Failed to assign driver: ' + error.message);
        }
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Delete)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all users (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All users deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid admin key',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAllUsers", null);
__decorate([
    (0, common_1.Get)('deliveries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all delivery services from all users (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: delivery_type_enum_1.DeliveryType }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: delivery_entity_1.DeliveryStatus }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All delivery services retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid admin key',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDeliveries", null);
__decorate([
    (0, common_1.Get)('deliveries/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery statistics (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delivery statistics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid admin key',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeliveryStats", null);
__decorate([
    (0, common_1.Get)('deliveries/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery service detail (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delivery detail retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid admin key',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Delivery not found',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDeliveryDetail", null);
__decorate([
    (0, common_1.Put)('deliveries/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update delivery status (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(delivery_entity_1.DeliveryStatus)
                }
            }
        } }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delivery status updated successfully',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateDeliveryStatus", null);
__decorate([
    (0, common_1.Put)('deliveries/:id/assign-driver'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign driver to delivery (Admin only)' }),
    (0, swagger_1.ApiHeader)({
        name: 'admin-key',
        description: 'Admin key for authentication',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: {
            type: 'object',
            properties: {
                driverId: { type: 'number' }
            }
        } }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Driver assigned successfully',
    }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignDriverToDelivery", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        delivery_service_1.DeliveryService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map