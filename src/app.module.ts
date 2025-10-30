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
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '5432', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // set to false when using migrations
        logging: configService.get('NODE_ENV') === 'development',
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        migrationsRun: true, // automatically run migrations
        
        // Optimized connection pool settings
        extra: {
          max: 20, // Maximum pool size
          min: 5,  // Minimum pool size
          idleTimeoutMillis: 30000, // Close idle connections after 30s
          connectionTimeoutMillis: 2000, // Timeout for new connections
        },
        poolSize: 10,
      }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
