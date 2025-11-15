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
exports.Order = exports.DeliveryType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const restaurant_entity_1 = require("../restaurants/restaurant.entity");
const order_item_entity_1 = require("./order-item.entity");
const shipping_manager_entity_1 = require("../shipping-managers/shipping-manager.entity");
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["REGULAR"] = "regular";
    DeliveryType["EXPRESS"] = "express";
    DeliveryType["SCHEDULED"] = "scheduled";
})(DeliveryType || (exports.DeliveryType = DeliveryType = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => restaurant_entity_1.Restaurant),
    (0, typeorm_1.JoinColumn)({ name: 'restaurantId' }),
    __metadata("design:type", restaurant_entity_1.Restaurant)
], Order.prototype, "restaurant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_1.OrderItem, orderItem => orderItem.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Order.prototype, "deliveryAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "deliveryCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "deliveryProvince", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "deliveryPostalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "deliveryZone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeliveryType,
        default: DeliveryType.REGULAR,
    }),
    __metadata("design:type", String)
], Order.prototype, "deliveryType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "scheduleTimeSlot", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "shippingManagerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shipping_manager_entity_1.ShippingManager, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'shippingManagerId' }),
    __metadata("design:type", shipping_manager_entity_1.ShippingManager)
], Order.prototype, "shippingManager", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map