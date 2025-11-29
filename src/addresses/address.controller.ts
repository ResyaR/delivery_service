import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(req.user.id, createAddressDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.addressService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.addressService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, req.user.id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.addressService.remove(+id, req.user.id);
  }

  @Patch(':id/set-default')
  setDefault(@Request() req, @Param('id') id: string) {
    return this.addressService.setDefault(+id, req.user.id);
  }
}

