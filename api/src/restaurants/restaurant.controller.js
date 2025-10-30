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
exports.RestaurantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restaurant_service_1 = require("./restaurant.service");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
let RestaurantController = class RestaurantController {
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
        this.ADMIN_KEY = 'resya123@';
    }
    validateAdminKey(adminKey) {
        if (adminKey !== this.ADMIN_KEY) {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
    }
    async create(adminKey, createRestaurantDto) {
        this.validateAdminKey(adminKey);
        const restaurant = await this.restaurantService.create(createRestaurantDto);
        return {
            message: 'Restaurant created successfully',
            data: restaurant,
        };
    }
    async findAll(status) {
        const restaurants = await this.restaurantService.findAll(status);
        return {
            message: 'Restaurants retrieved successfully',
            data: restaurants,
        };
    }
    async findOne(id) {
        const restaurant = await this.restaurantService.findOne(+id);
        return {
            message: 'Restaurant retrieved successfully',
            data: restaurant,
        };
    }
    async update(adminKey, id, updateRestaurantDto) {
        this.validateAdminKey(adminKey);
        const restaurant = await this.restaurantService.update(+id, updateRestaurantDto);
        return {
            message: 'Restaurant updated successfully',
            data: restaurant,
        };
    }
    async remove(adminKey, id) {
        this.validateAdminKey(adminKey);
        await this.restaurantService.remove(+id);
        return {
            message: 'Restaurant deleted successfully',
        };
    }
};
exports.RestaurantController = RestaurantController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create restaurant (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Restaurant created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_restaurant_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all restaurants' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'inactive'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restaurants retrieved successfully' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get restaurant by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restaurant retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Restaurant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update restaurant (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restaurant updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Restaurant not found' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete restaurant (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Restaurant deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Restaurant not found' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "remove", null);
exports.RestaurantController = RestaurantController = __decorate([
    (0, swagger_1.ApiTags)('restaurants'),
    (0, common_1.Controller)('restaurants'),
    __metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map