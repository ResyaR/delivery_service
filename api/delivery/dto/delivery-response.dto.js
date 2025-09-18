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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryCreateResponseDto = exports.DeliveryDetailResponseDto = exports.DeliveryListResponseDto = exports.DeliveryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const delivery_type_enum_1 = require("./delivery-type.enum");
const delivery_entity_1 = require("../delivery.entity");
class DeliveryResponseDto {
}
exports.DeliveryResponseDto = DeliveryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DeliveryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], DeliveryResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Merdeka No.1' }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Sudirman No.2' }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { itemName: 'Dokumen', scale: 'Ringan' }, required: false }),
    __metadata("design:type", Object)
], DeliveryResponseDto.prototype, "barang", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Beli barang di Indomaret', required: false }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "titipDeskripsi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-08T10:00:00Z', required: false }),
    __metadata("design:type", Date)
], DeliveryResponseDto.prototype, "jadwal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25000 }),
    __metadata("design:type", Number)
], DeliveryResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: delivery_type_enum_1.DeliveryType }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: delivery_entity_1.DeliveryStatus }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    __metadata("design:type", Number)
], DeliveryResponseDto.prototype, "driverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-08T12:00:00Z', required: false }),
    __metadata("design:type", Date)
], DeliveryResponseDto.prototype, "estimatedArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-08T12:30:00Z', required: false }),
    __metadata("design:type", Date)
], DeliveryResponseDto.prototype, "actualArrival", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Catatan tambahan', required: false }),
    __metadata("design:type", String)
], DeliveryResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-08T10:00:00Z' }),
    __metadata("design:type", Date)
], DeliveryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-08T10:00:00Z' }),
    __metadata("design:type", Date)
], DeliveryResponseDto.prototype, "updatedAt", void 0);
class DeliveryListResponseDto {
}
exports.DeliveryListResponseDto = DeliveryListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Delivery history fetched' }),
    __metadata("design:type", String)
], DeliveryListResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DeliveryResponseDto] }),
    __metadata("design:type", Array)
], DeliveryListResponseDto.prototype, "data", void 0);
class DeliveryDetailResponseDto {
}
exports.DeliveryDetailResponseDto = DeliveryDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Delivery status fetched' }),
    __metadata("design:type", String)
], DeliveryDetailResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DeliveryResponseDto }),
    __metadata("design:type", DeliveryResponseDto)
], DeliveryDetailResponseDto.prototype, "data", void 0);
class DeliveryCreateResponseDto {
}
exports.DeliveryCreateResponseDto = DeliveryCreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kirim Sekarang request created' }),
    __metadata("design:type", String)
], DeliveryCreateResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: DeliveryResponseDto }),
    __metadata("design:type", DeliveryResponseDto)
], DeliveryCreateResponseDto.prototype, "data", void 0);
//# sourceMappingURL=delivery-response.dto.js.map