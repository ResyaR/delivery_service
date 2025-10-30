import { Controller, Delete, Get, Put, Headers, UnauthorizedException, InternalServerErrorException, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from '../users/user.service';
import { DeliveryService } from '../delivery/delivery.service';
import { DeliveryType } from '../delivery/dto/delivery-type.enum';
import { DeliveryStatus } from '../delivery/delivery.entity';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly deliveryService: DeliveryService
  ) {}

  @Delete('users')
  @ApiOperation({ summary: 'Delete all users (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'All users deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid admin key',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async deleteAllUsers(@Headers('admin-key') adminKey: string) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      await this.userService.deleteAllUsers();
      return { message: 'All users deleted successfully' };
    } catch (error) {
      console.error('Error deleting users:', error);
      throw new InternalServerErrorException('Failed to delete users: ' + error.message);
    }
  }

  @Get('deliveries')
  @ApiOperation({ summary: 'Get all delivery services from all users (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiQuery({ name: 'type', required: false, enum: DeliveryType })
  @ApiQuery({ name: 'status', required: false, enum: DeliveryStatus })
  @ApiResponse({
    status: 200,
    description: 'All delivery services retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid admin key',
  })
  async getAllDeliveries(
    @Headers('admin-key') adminKey: string,
    @Query('type') type?: DeliveryType,
    @Query('status') status?: DeliveryStatus
  ) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      const filters = {};
      if (type) filters['type'] = type;
      if (status) filters['status'] = status;
      
      const deliveries = await this.deliveryService.findAllForAdmin(filters);
      return {
        message: 'Deliveries fetched successfully',
        data: deliveries
      };
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      throw new InternalServerErrorException('Failed to fetch deliveries: ' + error.message);
    }
  }

  @Get('deliveries/stats')
  @ApiOperation({ summary: 'Get delivery statistics (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid admin key',
  })
  async getDeliveryStats(@Headers('admin-key') adminKey: string) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      const stats = await this.deliveryService.getDeliveryStats();
      return {
        message: 'Stats fetched successfully',
        data: stats
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new InternalServerErrorException('Failed to fetch stats: ' + error.message);
    }
  }

  @Get('deliveries/:id')
  @ApiOperation({ summary: 'Get delivery service detail (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Delivery detail retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid admin key',
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery not found',
  })
  async getDeliveryDetail(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: number
  ) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      const delivery = await this.deliveryService.findOneById(Number(id));
      
      // If multi-drop, fetch drop locations
      let dropLocations: any[] = [];
      if (delivery.type === DeliveryType.MULTI_DROP) {
        dropLocations = await this.deliveryService.getMultiDropLocations(delivery.id);
      }
      
      return {
        message: 'Delivery detail fetched successfully',
        data: {
          ...delivery,
          dropLocations
        }
      };
    } catch (error) {
      console.error('Error fetching delivery detail:', error);
      throw new InternalServerErrorException('Failed to fetch delivery detail: ' + error.message);
    }
  }

  @Put('deliveries/:id/status')
  @ApiOperation({ summary: 'Update delivery status (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      status: { 
        type: 'string', 
        enum: Object.values(DeliveryStatus)
      }
    }
  }})
  @ApiResponse({
    status: 200,
    description: 'Delivery status updated successfully',
  })
  async updateDeliveryStatus(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: number,
    @Body() body: { status: DeliveryStatus }
  ) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      const delivery = await this.deliveryService.updateStatus(Number(id), body.status);
      return {
        message: 'Status updated successfully',
        data: delivery
      };
    } catch (error) {
      console.error('Error updating status:', error);
      throw new InternalServerErrorException('Failed to update status: ' + error.message);
    }
  }

  @Put('deliveries/:id/assign-driver')
  @ApiOperation({ summary: 'Assign driver to delivery (Admin only)' })
  @ApiHeader({
    name: 'admin-key',
    description: 'Admin key for authentication',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: {
    type: 'object',
    properties: {
      driverId: { type: 'number' }
    }
  }})
  @ApiResponse({
    status: 200,
    description: 'Driver assigned successfully',
  })
  async assignDriverToDelivery(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: number,
    @Body() body: { driverId: number }
  ) {
    if (adminKey !== 'resya123@') {
      throw new UnauthorizedException('Invalid admin key');
    }

    try {
      const delivery = await this.deliveryService.assignDriver(Number(id), body.driverId);
      return {
        message: 'Driver assigned successfully',
        data: delivery
      };
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw new InternalServerErrorException('Failed to assign driver: ' + error.message);
    }
  }
}