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
exports.MultiDropLocation = void 0;
const typeorm_1 = require("typeorm");
const delivery_entity_1 = require("./delivery.entity");
let MultiDropLocation = class MultiDropLocation {
};
exports.MultiDropLocation = MultiDropLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MultiDropLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MultiDropLocation.prototype, "deliveryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => delivery_entity_1.Delivery, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'deliveryId' }),
    __metadata("design:type", delivery_entity_1.Delivery)
], MultiDropLocation.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MultiDropLocation.prototype, "sequence", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MultiDropLocation.prototype, "locationName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MultiDropLocation.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MultiDropLocation.prototype, "recipientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MultiDropLocation.prototype, "recipientPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MultiDropLocation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], MultiDropLocation.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], MultiDropLocation.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MultiDropLocation.prototype, "arrivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MultiDropLocation.prototype, "isCompleted", void 0);
exports.MultiDropLocation = MultiDropLocation = __decorate([
    (0, typeorm_1.Entity)('multi_drop_locations')
], MultiDropLocation);
//# sourceMappingURL=multi-drop-location.entity.js.map