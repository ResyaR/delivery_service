"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const delivery_module_1 = require("./delivery/delivery.module");
const user_module_1 = require("./users/user.module");
const driver_module_1 = require("./drivers/driver.module");
const admin_module_1 = require("./admin/admin.module");
const ongkir_module_1 = require("./ongkir/ongkir.module");
const restaurant_module_1 = require("./restaurants/restaurant.module");
const menu_module_1 = require("./menus/menu.module");
const order_module_1 = require("./orders/order.module");
const cart_module_1 = require("./carts/cart.module");
const shipping_manager_module_1 = require("./shipping-managers/shipping-manager.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const isVercel = !!process.env.VERCEL;
                    const isProduction = configService.get('NODE_ENV') === 'production';
                    const poolConfig = isVercel ? {
                        max: 1,
                        min: 0,
                        idleTimeoutMillis: 10000,
                        connectionTimeoutMillis: 5000,
                        statement_timeout: 20000,
                        query_timeout: 20000,
                        allowExitOnIdle: true,
                        keepAlive: false,
                    } : {
                        max: 10,
                        min: 2,
                        idleTimeoutMillis: 30000,
                        connectionTimeoutMillis: 10000,
                        statement_timeout: 30000,
                        query_timeout: 30000,
                        allowExitOnIdle: false,
                        keepAlive: true,
                    };
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: parseInt(configService.get('DB_PORT') || '5432', 10),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        autoLoadEntities: true,
                        synchronize: false,
                        logging: configService.get('NODE_ENV') === 'development',
                        migrations: [__dirname + '/migrations/*.{js,ts}'],
                        migrationsRun: !isVercel,
                        ssl: isProduction ? { rejectUnauthorized: false } : false,
                        extra: poolConfig,
                        retryAttempts: isVercel ? 0 : 3,
                        retryDelay: isVercel ? 0 : 3000,
                        connectTimeoutMS: isVercel ? 5000 : 10000,
                        keepConnectionAlive: !isVercel,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            delivery_module_1.DeliveryModule,
            user_module_1.UsersModule,
            driver_module_1.DriverModule,
            admin_module_1.AdminModule,
            ongkir_module_1.OngkirModule,
            restaurant_module_1.RestaurantModule,
            menu_module_1.MenuModule,
            order_module_1.OrderModule,
            cart_module_1.CartModule,
            shipping_manager_module_1.ShippingManagerModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map