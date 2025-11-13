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
exports.ShippingManagerTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const shipping_manager_service_1 = require("../../shipping-managers/shipping-manager.service");
let ShippingManagerTokenGuard = class ShippingManagerTokenGuard {
    constructor(shippingManagerService) {
        this.shippingManagerService = shippingManagerService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers['shipping-manager-token'] || request.body?.token;
        if (!token) {
            throw new common_1.UnauthorizedException('Shipping manager token is required');
        }
        try {
            const manager = await this.shippingManagerService.findByToken(token);
            request.shippingManager = manager;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid shipping manager token');
        }
    }
};
exports.ShippingManagerTokenGuard = ShippingManagerTokenGuard;
exports.ShippingManagerTokenGuard = ShippingManagerTokenGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shipping_manager_service_1.ShippingManagerService])
], ShippingManagerTokenGuard);
//# sourceMappingURL=shipping-manager-token.guard.js.map