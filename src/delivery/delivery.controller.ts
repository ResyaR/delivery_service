import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
  Put,
  Headers,
  UnauthorizedException,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, CreateTitipBeliDto } from './dto/create-delivery.dto';
import { DeliveryListResponseDto, DeliveryDetailResponseDto, DeliveryCreateResponseDto } from './dto/delivery-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeliveryType } from './dto/delivery-type.enum';
import { DeliveryStatus } from './delivery.entity';
import { CreateMultiDropDeliveryDto } from './dto/create-multi-drop.dto';
import { CreateScheduledDeliveryDto } from './dto/create-scheduled-delivery.dto';
import { CreatePaketBesarDto } from './dto/create-paket-besar.dto';
import { ShippingManagerService } from '../shipping-managers/shipping-manager.service';

@ApiTags('delivery')
@ApiBearerAuth()
@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly shippingManagerService: ShippingManagerService,
  ) {}

  @Post('kirim-sekarang')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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

  @Post('multi-drop')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buat permintaan Multi-Drop (pengiriman ke multiple lokasi)' })
  @ApiBody({ type: CreateMultiDropDeliveryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan multi-drop berhasil dibuat.',
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
  async createMultiDrop(@Request() req, @Body() createDto: CreateMultiDropDeliveryDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.createMultiDropDelivery(req.user.id, createDto);
    return {
      message: 'Multi-Drop delivery request created',
      data: delivery
    };
  }

  @Post('scheduled')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buat permintaan Jadwal Pengiriman (scheduled delivery)' })
  @ApiBody({ type: CreateScheduledDeliveryDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan jadwal pengiriman berhasil dibuat.',
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
  async createScheduled(@Request() req, @Body() createDto: CreateScheduledDeliveryDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.createScheduledDelivery(req.user.id, createDto);
    return {
      message: 'Scheduled delivery request created',
      data: delivery
    };
  }

  @Post('paket-besar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buat permintaan Paket Besar/Ekspedisi Lokal' })
  @ApiBody({ type: CreatePaketBesarDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Permintaan paket besar berhasil dibuat.',
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
  async createPaketBesar(@Request() req, @Body() createDto: CreatePaketBesarDto): Promise<DeliveryCreateResponseDto> {
    const delivery = await this.deliveryService.createPaketBesarDelivery(req.user.id, createDto);
    return {
      message: 'Paket Besar delivery request created',
      data: delivery
    };
  }

  @Get(':id/drop-locations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ambil daftar lokasi drop untuk multi-drop delivery' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ 
    status: 200, 
    description: 'Daftar lokasi drop berhasil diambil.'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.'
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found.'
  })
  async getDropLocations(@Param('id') id: number) {
    const locations = await this.deliveryService.getMultiDropLocations(Number(id));
    return {
      message: 'Drop locations fetched successfully',
      data: locations
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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

  @Get('shipping-manager/zone/:zone')
  @ApiOperation({ summary: 'Get deliveries by zone (Shipping Manager)' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiQuery({ name: 'status', required: false, enum: DeliveryStatus })
  @ApiResponse({ status: 200, description: 'Deliveries retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDeliveriesByZone(
    @Headers('shipping-manager-token') token: string,
    @Param('zone') zone: string,
    @Query('status') status?: DeliveryStatus,
  ) {
    try {
      if (!token) {
        throw new UnauthorizedException('Shipping manager token is required');
      }
      
      const manager = await this.shippingManagerService.findByToken(token);
      if (!manager) {
        throw new UnauthorizedException('Invalid shipping manager token');
      }
      
      // Verify manager zone matches requested zone
      const zoneNumber = parseInt(zone);
      if (manager.zone !== zoneNumber) {
        throw new UnauthorizedException('You can only access deliveries from your assigned zone');
      }
      
      const deliveries = await this.deliveryService.findByZone(zoneNumber, status);
      
      return {
        message: 'Deliveries retrieved successfully',
        data: deliveries,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[DeliveryController] Error getting deliveries by zone:', error);
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }

  @Get('shipping-manager/my-deliveries')
  @ApiOperation({ summary: 'Get deliveries assigned to shipping manager' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiQuery({ name: 'status', required: false, enum: DeliveryStatus })
  @ApiResponse({ status: 200, description: 'Deliveries retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyDeliveries(
    @Headers('shipping-manager-token') token: string,
    @Query('status') status?: DeliveryStatus,
  ) {
    try {
      const manager = await this.shippingManagerService.findByToken(token);
      const deliveries = await this.deliveryService.findByShippingManager(manager.id, status);
      return {
        message: 'Deliveries retrieved successfully',
        data: deliveries,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }

  @Put('shipping-manager/:id/update-status')
  @ApiOperation({ summary: 'Update delivery status by shipping manager' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      status: { 
        type: 'string', 
        enum: Object.values(DeliveryStatus),
        example: 'accepted'
      }
    },
    required: ['status']
  }})
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid status transition or zone mismatch' })
  async updateStatusByShippingManager(
    @Headers('shipping-manager-token') token: string,
    @Param('id') id: string,
    @Body() body: { status: DeliveryStatus },
  ) {
    try {
      if (!token) {
        throw new UnauthorizedException('Shipping manager token is required');
      }
      
      const manager = await this.shippingManagerService.findByToken(token);
      if (!manager) {
        throw new UnauthorizedException('Invalid shipping manager token');
      }
      
      const delivery = await this.deliveryService.updateStatusByShippingManager(
        Number(id),
        body.status,
        manager.zone
      );
      
      return {
        message: 'Status updated successfully',
        data: delivery,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }

  @Get('public/track/:resiCode')
  @ApiOperation({ summary: 'Track delivery by resi code (public endpoint)' })
  @ApiParam({ name: 'resiCode', type: String, description: 'Resi code (format: MT-DEL-XXXXXX)' })
  @ApiResponse({ status: 200, description: 'Delivery found successfully' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async trackDelivery(@Param('resiCode') resiCode: string) {
    try {
      const delivery = await this.deliveryService.findByResiCode(resiCode);
      return {
        message: 'Delivery found successfully',
        data: delivery,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Delivery not found');
    }
  }
}
