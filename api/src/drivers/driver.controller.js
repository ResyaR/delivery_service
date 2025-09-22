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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const driver_service_1 = require("./driver.service");
const create_driver_dto_1 = require("./dto/create-driver.dto");
const update_location_dto_1 = require("./dto/update-location.dto");
const driver_entity_1 = require("./driver.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DriverController = class DriverController {
    constructor(driverService) {
        this.driverService = driverService;
    }
    async create(createDriverDto) {
        const driver = await this.driverService.create(createDriverDto);
        return {
            message: 'Driver registered successfully',
            data: {
                id: driver.id,
                fullName: driver.fullName,
                email: driver.email,
                phone: driver.phone,
                status: driver.status
            }
        };
    }
    async findAll() {
        const drivers = await this.driverService.findAll();
        return {
            message: 'Drivers fetched successfully',
            data: drivers
        };
    }
    async findAvailableDrivers() {
        const drivers = await this.driverService.findAvailableDrivers();
        return {
            message: 'Available drivers fetched successfully',
            data: drivers
        };
    }
    async findOne(id) {
        const driver = await this.driverService.findOne(id);
        return {
            message: 'Driver fetched successfully',
            data: driver
        };
    }
    async updateLocation(id, updateLocationDto) {
        const driver = await this.driverService.updateLocation(id, updateLocationDto);
        return {
            message: 'Location updated successfully',
            data: {
                id: driver.id,
                currentLatitude: driver.currentLatitude,
                currentLongitude: driver.currentLongitude
            }
        };
    }
    async updateStatus(id, body) {
        const driver = await this.driverService.updateStatus(id, body.status);
        return {
            message: 'Status updated successfully',
            data: {
                id: driver.id,
                status: driver.status
            }
        };
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register new driver' }),
    (0, swagger_1.ApiBody)({ type: create_driver_dto_1.CreateDriverDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Driver registered successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all drivers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all drivers.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available drivers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available drivers.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "findAvailableDrivers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get driver by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Driver not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver location' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ type: update_location_dto_1.UpdateLocationDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Driver not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver status' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(driver_entity_1.DriverStatus),
                    example: 'available'
                }
            },
            required: ['status']
        } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Driver not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "updateStatus", null);
exports.DriverController = DriverController = __decorate([
    (0, swagger_1.ApiTags)('drivers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map