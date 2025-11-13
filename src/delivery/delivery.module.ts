import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery } from './delivery.entity';
import { MultiDropLocation } from './multi-drop-location.entity';
import { ShippingManagerModule } from '../shipping-managers/shipping-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, MultiDropLocation]),
    ShippingManagerModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
