import { Module } from '@nestjs/common';
import { OngkirController } from './ongkir.controller';
import { OngkirService } from './ongkir.service';

@Module({
  controllers: [OngkirController],
  providers: [OngkirService],
  exports: [OngkirService],
})
export class OngkirModule {}

