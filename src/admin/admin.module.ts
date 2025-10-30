import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/user.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [UsersModule, DeliveryModule],
  controllers: [AdminController],
})
export class AdminModule {}