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
exports.OngkirController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ongkir_service_1 = require("./ongkir.service");
let OngkirController = class OngkirController {
    constructor(ongkirService) {
        this.ongkirService = ongkirService;
    }
    async getCities(province) {
        const cities = await this.ongkirService.getCities(province);
        return {
            message: 'Cities fetched successfully',
            data: cities,
        };
    }
    async getCityById(id) {
        const city = await this.ongkirService.getCityById(id);
        return {
            message: 'City fetched successfully',
            data: city,
        };
    }
    async createCity(body) {
        const city = await this.ongkirService.createCity(body);
        return {
            message: 'City created successfully',
            data: city,
        };
    }
    async updateCity(id, body) {
        const city = await this.ongkirService.updateCity(id, body);
        return {
            message: 'City updated successfully',
            data: city,
        };
    }
    async deleteCity(id) {
        await this.ongkirService.deleteCity(id);
        return {
            message: 'City deleted successfully',
        };
    }
    async getProvinces() {
        const provinces = await this.ongkirService.getProvinces();
        return {
            message: 'Provinces fetched successfully',
            data: provinces,
        };
    }
    async getServices() {
        const services = await this.ongkirService.getServices();
        return {
            message: 'Services fetched successfully',
            data: services,
        };
    }
    async getServiceById(id) {
        const service = await this.ongkirService.getServiceById(id);
        return {
            message: 'Service fetched successfully',
            data: service,
        };
    }
    async createService(body) {
        const service = await this.ongkirService.createService(body);
        return {
            message: 'Service created successfully',
            data: service,
        };
    }
    async updateService(id, body) {
        const service = await this.ongkirService.updateService(id, body);
        return {
            message: 'Service updated successfully',
            data: service,
        };
    }
    async deleteService(id) {
        await this.ongkirService.deleteService(id);
        return {
            message: 'Service deleted successfully',
        };
    }
    async getPricingRules() {
        const rules = await this.ongkirService.getPricingRules();
        return {
            message: 'Pricing rules fetched successfully',
            data: rules,
        };
    }
    async createPricingRule(body) {
        const rule = await this.ongkirService.createPricingRule(body);
        return {
            message: 'Pricing rule created successfully',
            data: rule,
        };
    }
    async updatePricingRule(id, body) {
        const rule = await this.ongkirService.updatePricingRule(id, body);
        return {
            message: 'Pricing rule updated successfully',
            data: rule,
        };
    }
    async deletePricingRule(id) {
        await this.ongkirService.deletePricingRule(id);
        return {
            message: 'Pricing rule deleted successfully',
        };
    }
    async getZones(province) {
        const zones = await this.ongkirService.getCities(province);
        return {
            message: 'Zones fetched successfully',
            data: zones,
        };
    }
    async calculateShipping(body) {
        const result = await this.ongkirService.calculateShipping(body);
        return {
            message: 'Shipping cost calculated successfully',
            data: result,
        };
    }
    async calculateByZone(body) {
        const result = await this.ongkirService.calculateOngkirByZone(body.originCityId, body.destCityId, body.serviceId, body.weight);
        return {
            message: 'Shipping cost calculated successfully',
            data: result,
        };
    }
    async getAllZoneTariffs() {
        const tariffs = await this.ongkirService.getAllZoneTariffs();
        return {
            message: 'Zone tariffs fetched successfully',
            data: tariffs,
        };
    }
    async getZoneTariff(zoneFrom, zoneTo, serviceId) {
        const tariff = await this.ongkirService.getZoneTariff(zoneFrom, zoneTo, serviceId);
        return {
            message: 'Zone tariff fetched successfully',
            data: tariff,
        };
    }
};
exports.OngkirController = OngkirController;
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cities' }),
    __param(0, (0, common_1.Query)('province')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('cities/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get city by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getCityById", null);
__decorate([
    (0, common_1.Post)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new city' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "createCity", null);
__decorate([
    (0, common_1.Put)('cities/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update city' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "updateCity", null);
__decorate([
    (0, common_1.Delete)('cities/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete city' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "deleteCity", null);
__decorate([
    (0, common_1.Get)('provinces'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all provinces' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getProvinces", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all services' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of services' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getServiceById", null);
__decorate([
    (0, common_1.Post)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new service' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "createService", null);
__decorate([
    (0, common_1.Put)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update service' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "updateService", null);
__decorate([
    (0, common_1.Delete)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete service' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)('pricing-rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pricing rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getPricingRules", null);
__decorate([
    (0, common_1.Post)('pricing-rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new pricing rule' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "createPricingRule", null);
__decorate([
    (0, common_1.Put)('pricing-rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update pricing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "updatePricingRule", null);
__decorate([
    (0, common_1.Delete)('pricing-rules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete pricing rule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "deletePricingRule", null);
__decorate([
    (0, common_1.Get)('zones'),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery zones (alias for cities)' }),
    __param(0, (0, common_1.Query)('province')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getZones", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate shipping cost' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "calculateShipping", null);
__decorate([
    (0, common_1.Post)('calculate-zone'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate shipping cost based on zone tariff' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipping cost calculated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "calculateByZone", null);
__decorate([
    (0, common_1.Get)('zone-tariffs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all zone tariffs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getAllZoneTariffs", null);
__decorate([
    (0, common_1.Get)('zone-tariff/:zoneFrom/:zoneTo/:serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get zone tariff by zones and service' }),
    __param(0, (0, common_1.Param)('zoneFrom')),
    __param(1, (0, common_1.Param)('zoneTo')),
    __param(2, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], OngkirController.prototype, "getZoneTariff", null);
exports.OngkirController = OngkirController = __decorate([
    (0, swagger_1.ApiTags)('ongkir'),
    (0, common_1.Controller)('ongkir'),
    __metadata("design:paramtypes", [ongkir_service_1.OngkirService])
], OngkirController);
//# sourceMappingURL=ongkir.controller.js.map