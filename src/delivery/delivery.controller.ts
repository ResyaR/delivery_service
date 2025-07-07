import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Query
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeliveryType } from './dto/delivery-type.enum';

@ApiTags('delivery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('kirim-sekarang')
  @ApiOperation({ summary: 'Buat permintaan Kirim Sekarang (langsung antar barang)' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      pickupLocation: { type: 'string', example: 'Jl. Merdeka No.1' },
      dropoffLocation: { type: 'string', example: 'Jl. Sudirman No.2' },
      barang: {
        type: 'object',
        properties: {
          itemName: { type: 'string', example: 'Dokumen' },
          scale: { type: 'string', example: 'Ringan' }
        },
        required: ['itemName', 'scale']
      },
      price: { type: 'number', example: 25000 },
      type: { type: 'string', enum: ['KIRIM_SEKARANG'], example: 'KIRIM_SEKARANG' }
    },
    required: ['pickupLocation', 'dropoffLocation', 'barang', 'type']
  } })
  @ApiResponse({ status: 201, description: 'Permintaan kirim sekarang berhasil dibuat.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  createKirimSekarang(@Request() req, @Body() dto: CreateDeliveryDto) {
    return {
      message: 'Kirim Sekarang request created',
      data: this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.KIRIM_SEKARANG }, DeliveryType.KIRIM_SEKARANG)
    };
  }

  @Post('jadwal')
  @ApiOperation({ summary: 'Buat permintaan Jadwal Pengantaran (antar barang terjadwal)' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      pickupLocation: { type: 'string', example: 'Jl. Merdeka No.1' },
      dropoffLocation: { type: 'string', example: 'Jl. Sudirman No.2' },
      barang: {
        type: 'object',
        properties: {
          itemName: { type: 'string', example: 'Paket' },
          scale: { type: 'string', example: 'Sedang' }
        },
        required: ['itemName', 'scale']
      },
      jadwal: { type: 'string', example: '2025-07-08T10:00:00Z' },
      price: { type: 'number', example: 35000 },
      type: { type: 'string', enum: ['JADWAL'], example: 'JADWAL' }
    },
    required: ['pickupLocation', 'dropoffLocation', 'barang', 'jadwal', 'type']
  } })
  @ApiResponse({ status: 201, description: 'Permintaan jadwal pengantaran berhasil dibuat.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  createJadwal(@Request() req, @Body() dto: CreateDeliveryDto) {
    return {
      message: 'Jadwal Pengantaran request created',
      data: this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.JADWAL }, DeliveryType.JADWAL)
    };
  }

  @Post('titip-beli')
  @ApiOperation({ summary: 'Buat permintaan Titip Beli (proxy shopping)' })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      pickupLocation: { type: 'string', example: 'Toko Indomaret' },
      dropoffLocation: { type: 'string', example: 'Jl. Sudirman No.2' },
      titipDeskripsi: { type: 'string', example: 'Beli 2 botol air mineral dan 1 snack' },
      price: { type: 'number', example: 25000 },
      type: { type: 'string', enum: ['TITIP_BELI'], example: 'TITIP_BELI' }
    },
    required: ['pickupLocation', 'dropoffLocation', 'titipDeskripsi', 'type']
  } })
  @ApiResponse({ status: 201, description: 'Permintaan titip beli berhasil dibuat.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  createTitipBeli(@Request() req, @Body() dto: CreateDeliveryDto) {
    // Validasi minimal titipDeskripsi wajib diisi
    if (!dto.titipDeskripsi) {
      return { message: 'titipDeskripsi is required for titip-beli', statusCode: 400 };
    }
    return {
      message: 'Titip Beli request created',
      data: this.deliveryService.create(req.user.id, { ...dto, type: DeliveryType.TITIP_BELI }, DeliveryType.TITIP_BELI)
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Ambil riwayat permintaan pengantaran user' })
  @ApiQuery({ name: 'type', required: false, enum: DeliveryType })
  @ApiResponse({ status: 200, description: 'Daftar riwayat pengantaran.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  getHistory(@Request() req, @Query('type') type?: DeliveryType) {
    return {
      message: 'Delivery history fetched',
      data: this.deliveryService.findAll(req.user.id, type)
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail status pengantaran' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detail status pengantaran.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token tidak valid atau tidak ada.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  })
  getStatus(@Request() req, @Param('id') id: number) {
    return {
      message: 'Delivery status fetched',
      data: this.deliveryService.findOne(req.user.id, Number(id))
    };
  }
}
