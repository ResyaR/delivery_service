"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingManagerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shipping_manager_entity_1 = require("./shipping-manager.entity");
const shipping_manager_service_1 = require("./shipping-manager.service");
const shipping_manager_controller_1 = require("./shipping-manager.controller");
const user_module_1 = require("../users/user.module");
let ShippingManagerModule = class ShippingManagerModule {
};
exports.ShippingManagerModule = ShippingManagerModule;
exports.ShippingManagerModule = ShippingManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([shipping_manager_entity_1.ShippingManager]),
            user_module_1.UsersModule,
        ],
        controllers: [shipping_manager_controller_1.ShippingManagerController],
        providers: [shipping_manager_service_1.ShippingManagerService],
        exports: [shipping_manager_service_1.ShippingManagerService],
    })
], ShippingManagerModule);
//# sourceMappingURL=shipping-manager.module.js.map