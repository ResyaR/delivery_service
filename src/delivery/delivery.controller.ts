import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
  Put
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, CreateTitipBeliDto } from './dto/create-delivery.dto';
import { DeliveryListResponseDto, DeliveryDetailResponseDto, DeliveryCreateResponseDto } from './dto/delivery-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeliveryType } from './dto/delivery-type.enum';
import { DeliveryStatus } from './delivery.entity';

@ApiTags('delivery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('kirim-sekarang')
  @ApiOperation({ summary: 'Buat permintaan Kirim Sekarang (langsung antar barang)' })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan kirim sekarang berhasil dibuat.',
    type: DeliveryCreateResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async createKirimSekarang(@Request() req, @Body() dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.KIRIM_SEKARANG }, DeliveryType.KIRIM_SEKARANG);
    return {
      message: 'Kirim Sekarang request created',
      data: delivery
    };
  }

  @Post('jadwal')
  @ApiOperation({ summary: 'Buat permintaan Jadwal Pengantaran (antar barang terjadwal)' })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan jadwal pengantaran berhasil dibuat.',
    type: DeliveryCreateResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async createJadwal(@Request() req, @Body() dto: CreateDeliveryDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.JADWAL }, DeliveryType.JADWAL);
    return {
      message: 'Jadwal Pengantaran request created',
      data: delivery
    };
  }

  @Post('titip-beli')
  @ApiOperation({ summary: 'Buat permintaan Titip Beli (proxy shopping)' })
  @ApiBody({ type: CreateTitipBeliDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan titip beli berhasil dibuat.',
    type: DeliveryCreateResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. titipDeskripsi is required.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async createTitipBeli(@Request() req, @Body() dto: CreateTitipBeliDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.TITIP_BELI }, DeliveryType.TITIP_BELI);
    return {
      message: 'Titip Beli request created',
      data: delivery
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Ambil riwayat permintaan pengantaran user' })
  @ApiQuery({ name: 'type', required: false, enum: DeliveryType })
  @ApiResponse({ 
    status: 200, 
    description: 'Daftar riwayat pengantaran.',
    type: DeliveryListResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async getHistory(@Request() req, @Query('type') type?: DeliveryType): Promise<DeliveryListResponseDto> {
    const deliveries = await this.deliveryService.findAll(req.user.id, type);
    return {
      message: 'Delivery history fetched',
      data: deliveries
    };
  }

  @Get('pending')
  @ApiOperation({ summary: 'Ambil daftar pengantaran pending (untuk driver)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Daftar pengantaran pending.',
    type: DeliveryListResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async getPendingDeliveries(): Promise<DeliveryListResponseDto> {
    const deliveries = await this.deliveryService.findPendingDeliveries();
    return {
      message: 'Pending deliveries fetched',
      data: deliveries
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail status pengantaran' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Detail status pengantaran.',
    type: DeliveryDetailResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async getStatus(@Request() req, @Param('id') id: number): Promise<DeliveryDetailResponseDto> {
    const delivery = await this.deliveryService.findOne(req.user.id, Number(id));
    return {
      message: 'Delivery status fetched',
      data: delivery
    };
  }

  @Put(':id/assign-driver')
  @ApiOperation({ summary: 'Assign driver ke pengantaran (untuk admin/driver)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      driverId: { type: 'number', example: 1 }
    },
    required: ['driverId']
  }})
  @ApiResponse({ 
    status: 200, 
    description: 'Driver berhasil di-assign.',
    type: DeliveryDetailResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async assignDriver(@Param('id') id: number, @Body() body: { driverId: number }): Promise<DeliveryDetailResponseDto> {
    const delivery = await this.deliveryService.assignDriver(Number(id), body.driverId);
    return {
      message: 'Driver assigned successfully',
      data: delivery
    };
  }

  @Put(':id/update-status')
  @ApiOperation({ summary: 'Update status pengantaran (untuk driver)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      status: { 
        type: 'string', 
        enum: Object.values(DeliveryStatus),
        example: 'picked_up'
      }
    },
    required: ['status']
  }})
  @ApiResponse({ 
    status: 200, 
    description: 'Status berhasil diupdate.',
    type: DeliveryDetailResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async updateStatus(@Param('id') id: number, @Body() body: { status: DeliveryStatus }): Promise<DeliveryDetailResponseDto> {
    const delivery = await this.deliveryService.updateStatus(Number(id), body.status);
    return {
      message: 'Status updated successfully',
      data: delivery
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Batalkan permintaan pengantaran' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Permintaan pengantaran berhasil dibatalkan.',
    type: DeliveryDetailResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found.'
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.'
  })
  async cancelDelivery(@Request() req, @Param('id') id: number): Promise<DeliveryDetailResponseDto> {
    const delivery = await this.deliveryService.cancelDelivery(Number(id), req.user.id);
    return {
      message: 'Delivery cancelled successfully',
      data: delivery
    };
  }
}
