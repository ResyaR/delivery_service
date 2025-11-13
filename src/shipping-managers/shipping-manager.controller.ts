import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShippingManagerService } from './shipping-manager.service';
import { CreateShippingManagerDto } from './dto/create-shipping-manager.dto';
import { UpdateShippingManagerDto } from './dto/update-shipping-manager.dto';
import { AdminTokenGuard } from '../common/middleware/admin-token.middleware';

@Controller('shipping-managers')
export class ShippingManagerController {
  constructor(private readonly shippingManagerService: ShippingManagerService) {}

  @Post()
  @UseGuards(AdminTokenGuard)
  create(@Body() createDto: CreateShippingManagerDto) {
    return this.shippingManagerService.create(createDto);
  }

  @Get()
  @UseGuards(AdminTokenGuard)
  findAll() {
    return this.shippingManagerService.findAll();
  }

  @Get('zone/:zone')
  @UseGuards(AdminTokenGuard)
  findByZone(@Param('zone') zone: string) {
    return this.shippingManagerService.findByZone(parseInt(zone));
  }

  @Get(':id')
  @UseGuards(AdminTokenGuard)
  findOne(@Param('id') id: string) {
    return this.shippingManagerService.findOne(parseInt(id));
  }

  @Patch(':id')
  @UseGuards(AdminTokenGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateShippingManagerDto) {
    return this.shippingManagerService.update(parseInt(id), updateDto);
  }

  @Post(':id/regenerate-token')
  @UseGuards(AdminTokenGuard)
  regenerateToken(@Param('id') id: string) {
    return this.shippingManagerService.regenerateToken(parseInt(id));
  }

  @Delete(':id')
  @UseGuards(AdminTokenGuard)
  remove(@Param('id') id: string) {
    return this.shippingManagerService.remove(parseInt(id));
  }
}

