import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { ShippingManagerModule } from '../shipping-managers/shipping-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    RestaurantModule,
    ShippingManagerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {
  // ShippingManagerService is already provided by ShippingManagerModule
}

