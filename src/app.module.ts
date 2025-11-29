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
        
        // Untuk serverless (Vercel), gunakan connection pool yang sangat kecil
        // karena setiap request bisa membuat instance baru
        // Solusinya: gunakan SINGLETON connection pool dengan max: 1
        const poolConfig = isVercel ? {
          max: 1, // HANYA 1 connection per instance (penting untuk serverless!)
          min: 0, // Tidak perlu maintain minimum connections
          idleTimeoutMillis: 30000, // Close idle connections setelah 30s
          connectionTimeoutMillis: 20000, // Increase ke 20s untuk give more time saat cold start
          statement_timeout: 30000, // Query timeout 30s
          query_timeout: 30000,
          allowExitOnIdle: true, // Allow process exit ketika idle
          // Test koneksi sebelum digunakan (ping database untuk ensure connection is alive)
          testOnBorrow: false, // Disable karena bisa menyebabkan timeout issues
          // Reuse connection yang sama untuk semua query dalam instance yang sama
          keepAlive: false, // Tidak perlu keep alive di serverless (setiap request fresh)
        } : {
          // Untuk development/local, gunakan pool yang lebih besar
          max: 10,
          min: 2,
          idleTimeoutMillis: 60000, // 60s untuk development
          connectionTimeoutMillis: 20000, // 20s untuk development
          statement_timeout: 30000,
          query_timeout: 30000,
          allowExitOnIdle: false,
          keepAlive: true,
          keepAliveInitialDelayMillis: 10000, // Start keepAlive after 10s
          // Test koneksi sebelum digunakan - simplified untuk avoid timeout
          testOnBorrow: false, // Disable untuk avoid timeout issues
          // Error handler untuk connection pool
          errorHandler: (err: Error, client: any) => {
            console.error('Connection pool error:', err.message);
            // Don't throw, let pool handle reconnection
          },
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
          migrationsRun: !isVercel, // Jangan auto-run migrations di Vercel
          
          // SSL untuk production
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          
          // Connection pool settings untuk serverless
          extra: poolConfig,
          
          // Retry settings - Enable retry untuk development
          retryAttempts: isVercel ? 0 : 5, // Increase retry attempts untuk development
          retryDelay: isVercel ? 0 : 2000, // 2s delay between retries
          
          // Connection options
          connectTimeoutMS: isVercel ? 20000 : 20000, // 20s timeout
          keepConnectionAlive: !isVercel, // Keep alive untuk development
          
          // Additional connection options untuk stability
          options: `-c statement_timeout=${isVercel ? 30000 : 30000}`,
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
