import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { DriverStatus } from './driver.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiOperation({ summary: 'Register new driver' })
  @ApiBody({ type: CreateDriverDto })
  @ApiResponse({ status: 201, description: 'Driver registered successfully.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  async create(@Body() createDriverDto: CreateDriverDto) {
    const driver = await this.driverService.create(createDriverDto);
    return {
      message: 'Driver registered successfully',
      data: {
        id: driver.id,
        fullName: driver.fullName,
        email: driver.email,
        phone: driver.phone,
        status: driver.status
      }
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'List of all drivers.' })
  async findAll() {
    const drivers = await this.driverService.findAll();
    return {
      message: 'Drivers fetched successfully',
      data: drivers
    };
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available drivers' })
  @ApiResponse({ status: 200, description: 'List of available drivers.' })
  async findAvailableDrivers() {
    const drivers = await this.driverService.findAvailableDrivers();
    return {
      message: 'Available drivers fetched successfully',
      data: drivers
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Driver details.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async findOne(@Param('id') id: number) {
    const driver = await this.driverService.findOne(id);
    return {
      message: 'Driver fetched successfully',
      data: driver
    };
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update driver location' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({ status: 200, description: 'Location updated successfully.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async updateLocation(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    const driver = await this.driverService.updateLocation(id, updateLocationDto);
    return {
      message: 'Location updated successfully',
      data: {
        id: driver.id,
        currentLatitude: driver.currentLatitude,
        currentLongitude: driver.currentLongitude
      }
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update driver status' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      status: { 
        type: 'string', 
        enum: Object.values(DriverStatus),
        example: 'available'
      }
    },
    required: ['status']
  }})
  @ApiResponse({ status: 200, description: 'Status updated successfully.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async updateStatus(
    @Param('id') id: number,
    @Body() body: { status: DriverStatus }
  ) {
    const driver = await this.driverService.updateStatus(id, body.status);
    return {
      message: 'Status updated successfully',
      data: {
        id: driver.id,
        status: driver.status
      }
    };
  }
} 