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
exports.CreateTitipBeliDto = exports.CreateDeliveryDto = exports.BarangDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const delivery_type_enum_1 = require("./delivery-type.enum");
class BarangDto {
}
exports.BarangDto = BarangDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dokumen', description: 'Nama barang' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BarangDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ringan', description: 'Skala/berat barang' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BarangDto.prototype, "scale", void 0);
class CreateDeliveryDto {
}
exports.CreateDeliveryDto = CreateDeliveryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Merdeka No.1', description: 'Lokasi penjemputan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Sudirman No.2', description: 'Lokasi tujuan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BarangDto, required: false, description: 'Barang untuk kirim/jadwal. Tidak wajib untuk titip beli.' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BarangDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", BarangDto)
], CreateDeliveryDto.prototype, "barang", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-07-08T10:00:00Z', description: 'Jadwal pengantaran (opsional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "jadwal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Beli barang di Indomaret', description: 'Deskripsi titip beli (khusus TITIP_BELI)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "titipDeskripsi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25000, description: 'Estimasi harga (opsional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: delivery_type_enum_1.DeliveryType }),
    (0, class_validator_1.IsEnum)(delivery_type_enum_1.DeliveryType),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "type", void 0);
class CreateTitipBeliDto {
}
exports.CreateTitipBeliDto = CreateTitipBeliDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Merdeka No.1', description: 'Lokasi penjemputan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTitipBeliDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Sudirman No.2', description: 'Lokasi tujuan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTitipBeliDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Beli barang di Indomaret', description: 'Deskripsi titip beli' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTitipBeliDto.prototype, "titipDeskripsi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25000, description: 'Estimasi harga (opsional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTitipBeliDto.prototype, "price", void 0);
//# sourceMappingURL=create-delivery.dto.js.map