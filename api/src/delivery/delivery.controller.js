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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delivery_service_1 = require("./delivery.service");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const delivery_response_dto_1 = require("./dto/delivery-response.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const delivery_type_enum_1 = require("./dto/delivery-type.enum");
const delivery_entity_1 = require("./delivery.entity");
let DeliveryController = class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    async createKirimSekarang(req, dto) {
        const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: delivery_type_enum_1.DeliveryType.KIRIM_SEKARANG }, delivery_type_enum_1.DeliveryType.KIRIM_SEKARANG);
        return {
            message: 'Kirim Sekarang request created',
            data: delivery
        };
    }
    async createJadwal(req, dto) {
        const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: delivery_type_enum_1.DeliveryType.JADWAL }, delivery_type_enum_1.DeliveryType.JADWAL);
        return {
            message: 'Jadwal Pengantaran request created',
            data: delivery
        };
    }
    async createTitipBeli(req, dto) {
        const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: delivery_type_enum_1.DeliveryType.TITIP_BELI }, delivery_type_enum_1.DeliveryType.TITIP_BELI);
        return {
            message: 'Titip Beli request created',
            data: delivery
        };
    }
    async getHistory(req, type) {
        const deliveries = await this.deliveryService.findAll(req.user.id, type);
        return {
            message: 'Delivery history fetched',
            data: deliveries
        };
    }
    async getPendingDeliveries() {
        const deliveries = await this.deliveryService.findPendingDeliveries();
        return {
            message: 'Pending deliveries fetched',
            data: deliveries
        };
    }
    async getStatus(req, id) {
        const delivery = await this.deliveryService.findOne(req.user.id, Number(id));
        return {
            message: 'Delivery status fetched',
            data: delivery
        };
    }
    async assignDriver(id, body) {
        const delivery = await this.deliveryService.assignDriver(Number(id), body.driverId);
        return {
            message: 'Driver assigned successfully',
            data: delivery
        };
    }
    async updateStatus(id, body) {
        const delivery = await this.deliveryService.updateStatus(Number(id), body.status);
        return {
            message: 'Status updated successfully',
            data: delivery
        };
    }
    async cancelDelivery(req, id) {
        const delivery = await this.deliveryService.cancelDelivery(Number(id), req.user.id);
        return {
            message: 'Delivery cancelled successfully',
            data: delivery
        };
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Post)('kirim-sekarang'),
    (0, swagger_1.ApiOperation)({ summary: 'Buat permintaan Kirim Sekarang (langsung antar barang)' }),
    (0, swagger_1.ApiBody)({ type: create_delivery_dto_1.CreateDeliveryDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permintaan kirim sekarang berhasil dibuat.',
        type: delivery_response_dto_1.DeliveryCreateResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createKirimSekarang", null);
__decorate([
    (0, common_1.Post)('jadwal'),
    (0, swagger_1.ApiOperation)({ summary: 'Buat permintaan Jadwal Pengantaran (antar barang terjadwal)' }),
    (0, swagger_1.ApiBody)({ type: create_delivery_dto_1.CreateDeliveryDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permintaan jadwal pengantaran berhasil dibuat.',
        type: delivery_response_dto_1.DeliveryCreateResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createJadwal", null);
__decorate([
    (0, common_1.Post)('titip-beli'),
    (0, swagger_1.ApiOperation)({ summary: 'Buat permintaan Titip Beli (proxy shopping)' }),
    (0, swagger_1.ApiBody)({ type: create_delivery_dto_1.CreateTitipBeliDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permintaan titip beli berhasil dibuat.',
        type: delivery_response_dto_1.DeliveryCreateResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request. titipDeskripsi is required.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_delivery_dto_1.CreateTitipBeliDto]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createTitipBeli", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil riwayat permintaan pengantaran user' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: delivery_type_enum_1.DeliveryType }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar riwayat pengantaran.',
        type: delivery_response_dto_1.DeliveryListResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil daftar pengantaran pending (untuk driver)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar pengantaran pending.',
        type: delivery_response_dto_1.DeliveryListResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getPendingDeliveries", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil detail status pengantaran' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detail status pengantaran.',
        type: delivery_response_dto_1.DeliveryDetailResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Delivery not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign-driver'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign driver ke pengantaran (untuk admin/driver)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: {
            type: 'object',
            properties: {
                driverId: { type: 'number', example: 1 }
            },
            required: ['driverId']
        } }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Driver berhasil di-assign.',
        type: delivery_response_dto_1.DeliveryDetailResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Delivery not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.Put)(':id/update-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update status pengantaran (untuk driver)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({ schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(delivery_entity_1.DeliveryStatus),
                    example: 'picked_up'
                }
            },
            required: ['status']
        } }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Status berhasil diupdate.',
        type: delivery_response_dto_1.DeliveryDetailResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Delivery not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Batalkan permintaan pengantaran' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permintaan pengantaran berhasil dibatalkan.',
        type: delivery_response_dto_1.DeliveryDetailResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Token tidak valid atau tidak ada.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Delivery not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error.'
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "cancelDelivery", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('delivery'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('delivery'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map