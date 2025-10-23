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
        migrations: [__dirname + '/migrations/*.{js,ts}'],
        migrationsRun: true, // automatically run migrations
        extra: {
          max: 5,
          poolSize: 5,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DeliveryModule,
    UsersModule,
    DriverModule,
    AdminModule,
    OngkirModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
