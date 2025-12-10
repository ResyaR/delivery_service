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
const core_1 = require("@nestjs/core");
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
const address_module_1 = require("./addresses/address.module");
const db_connection_interceptor_1 = require("./common/interceptors/db-connection.interceptor");
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
                        max: 2,
                        min: 0,
                        idleTimeoutMillis: 10000,
                        connectionTimeoutMillis: 10000,
                        statement_timeout: 25000,
                        query_timeout: 25000,
                        allowExitOnIdle: true,
                        application_name: 'delivery_service_vercel',
                    } : {
                        max: 10,
                        min: 2,
                        idleTimeoutMillis: 60000,
                        connectionTimeoutMillis: 15000,
                        statement_timeout: 30000,
                        query_timeout: 30000,
                        allowExitOnIdle: false,
                        keepAlive: true,
                        keepAliveInitialDelayMillis: 10000,
                        application_name: 'delivery_service_dev',
                    };
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: parseInt(configService.get('DB_PORT') || '6543', 10),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        autoLoadEntities: true,
                        synchronize: false,
                        logging: !isProduction ? ['error', 'warn'] : false,
                        migrations: [__dirname + '/migrations/*.{js,ts}'],
                        migrationsRun: false,
                        ssl: { rejectUnauthorized: false },
                        extra: poolConfig,
                        retryAttempts: isVercel ? 2 : 5,
                        retryDelay: isVercel ? 1000 : 2000,
                        connectTimeoutMS: isVercel ? 10000 : 15000,
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
            address_module_1.AddressModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: db_connection_interceptor_1.DbConnectionInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map