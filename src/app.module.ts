import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DeliveryModule } from './delivery/delivery.module';
import { UsersModule } from './users/user.module';
import { DriverModule } from './drivers/driver.module';
import { AdminModule } from './admin/admin.module';
import { OngkirModule } from './ongkir/ongkir.module';
import { RestaurantModule } from './restaurants/restaurant.module';
import { MenuModule } from './menus/menu.module';
import { OrderModule } from './orders/order.module';
import { CartModule } from './carts/cart.module';
import { ShippingManagerModule } from './shipping-managers/shipping-manager.module';
import { AddressModule } from './addresses/address.module';
import { DbConnectionInterceptor } from './common/interceptors/db-connection.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isVercel = !!process.env.VERCEL;
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // Konfigurasi untuk Supabase Transaction Pooler (PgBouncer)
        // Transaction pooler lebih cocok untuk serverless
        const poolConfig = isVercel ? {
          max: 2, // Sedikit lebih dari 1 untuk handle concurrent queries
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
          
          // SSL wajib untuk Supabase
          ssl: { rejectUnauthorized: false },
          
          // Connection pool settings
          extra: poolConfig,
          
          // Retry settings
          retryAttempts: isVercel ? 2 : 5,
          retryDelay: isVercel ? 1000 : 2000,
          
          // Connection timeout
          connectTimeoutMS: isVercel ? 10000 : 15000,
          keepConnectionAlive: !isVercel,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    DeliveryModule,
    UsersModule,
    DriverModule,
    AdminModule,
    OngkirModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    CartModule,
    ShippingManagerModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DbConnectionInterceptor,
    },
  ],
})
export class AppModule {}
