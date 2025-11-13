import { Module } from '@nestjs/common';
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
          idleTimeoutMillis: 10000, // Close idle connections cepat (10s)
          connectionTimeoutMillis: 5000, // Timeout cepat untuk fail fast
          statement_timeout: 20000, // Query timeout 20s
          query_timeout: 20000,
          allowExitOnIdle: true, // Allow process exit ketika idle
          // Reuse connection yang sama untuk semua query dalam instance yang sama
          keepAlive: false, // Tidak perlu keep alive di serverless
        } : {
          // Untuk development/local, gunakan pool yang lebih besar
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
          migrationsRun: !isVercel, // Jangan auto-run migrations di Vercel
          
          // SSL untuk production
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          
          // Connection pool settings untuk serverless
          extra: poolConfig,
          
          // Retry settings - NO retry di serverless untuk avoid connection buildup
          retryAttempts: isVercel ? 0 : 3,
          retryDelay: isVercel ? 0 : 3000,
          
          // Connection options
          connectTimeoutMS: isVercel ? 5000 : 10000,
          keepConnectionAlive: !isVercel, // Jangan keep alive di serverless
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
