import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}