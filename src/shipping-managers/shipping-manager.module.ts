import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingManager } from './shipping-manager.entity';
import { ShippingManagerService } from './shipping-manager.service';
import { ShippingManagerController } from './shipping-manager.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingManager])],
  controllers: [ShippingManagerController],
  providers: [ShippingManagerService],
  exports: [ShippingManagerService],
})
export class ShippingManagerModule {}

