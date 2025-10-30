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
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
        this.ADMIN_KEY = 'resya123@';
    }
    validateAdminKey(adminKey) {
        if (adminKey !== this.ADMIN_KEY) {
            throw new common_1.UnauthorizedException('Invalid admin key');
        }
    }
    async create(adminKey, createMenuDto) {
        this.validateAdminKey(adminKey);
        const menu = await this.menuService.create(createMenuDto);
        return {
            message: 'Menu created successfully',
            data: menu,
        };
    }
    async findAll(restaurantId) {
        const menus = await this.menuService.findAll(restaurantId ? +restaurantId : undefined);
        return {
            message: 'Menus retrieved successfully',
            data: menus,
        };
    }
    async findByRestaurant(restaurantId) {
        const menus = await this.menuService.findByRestaurant(+restaurantId);
        return {
            message: 'Menus retrieved successfully',
            data: menus,
        };
    }
    async findOne(id) {
        const menu = await this.menuService.findOne(+id);
        return {
            message: 'Menu retrieved successfully',
            data: menu,
        };
    }
    async update(adminKey, id, updateMenuDto) {
        this.validateAdminKey(adminKey);
        const menu = await this.menuService.update(+id, updateMenuDto);
        return {
            message: 'Menu updated successfully',
            data: menu,
        };
    }
    async updateAvailability(adminKey, id, availability) {
        this.validateAdminKey(adminKey);
        const menu = await this.menuService.updateAvailability(+id, availability);
        return {
            message: 'Menu availability updated',
            data: menu,
        };
    }
    async remove(adminKey, id) {
        this.validateAdminKey(adminKey);
        await this.menuService.remove(+id);
        return {
            message: 'Menu deleted successfully',
        };
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create menu item (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Menu created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all menus' }),
    (0, swagger_1.ApiQuery)({ name: 'restaurantId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menus retrieved successfully' }),
    __param(0, (0, common_1.Query)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menus by restaurant ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menus retrieved successfully' }),
    __param(0, (0, common_1.Param)('restaurantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findByRestaurant", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get menu by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update menu (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu not found' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update menu availability (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu availability updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('availability')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete menu (Admin only)' }),
    (0, swagger_1.ApiHeader)({ name: 'admin-key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu not found' }),
    __param(0, (0, common_1.Headers)('admin-key')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "remove", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('menus'),
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map