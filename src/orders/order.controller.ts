import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ShippingManagerService } from '../shipping-managers/shipping-manager.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  private readonly ADMIN_KEY = 'resya123@';

  constructor(
    private readonly orderService: OrderService,
    private readonly shippingManagerService: ShippingManagerService,
  ) {}

  private validateAdminKey(adminKey: string): void {
    if (adminKey !== this.ADMIN_KEY) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create food order (User authenticated)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.create(req.user.id, createOrderDto);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Headers('admin-key') adminKey: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    this.validateAdminKey(adminKey);
    const orders = await this.orderService.findAll(
      userId ? +userId : undefined,
      status,
    );
    return {
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders (User authenticated)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyOrders(@Request() req) {
    const orders = await this.orderService.getUserOrders(req.user.id);
    return {
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get('track/:orderNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Track order by order number (User authenticated)' })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async trackOrder(
    @Request() req,
    @Param('orderNumber') orderNumber: string,
  ) {
    const order = await this.orderService.findByOrderNumber(
      req.user.id,
      orderNumber,
    );
    return {
      message: 'Order found successfully',
      data: order,
    };
  }

  @Get('public/track/:orderNumber')
  @ApiOperation({ summary: 'Track order by resi number (Public - No login required)' })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async trackOrderPublic(
    @Param('orderNumber') orderNumber: string,
  ) {
    const order = await this.orderService.findByOrderNumberPublic(orderNumber);
    return {
      message: 'Resi ditemukan',
      data: order,
    };
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get restaurant orders (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRestaurantOrders(
    @Headers('admin-key') adminKey: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    this.validateAdminKey(adminKey);
    const orders = await this.orderService.getRestaurantOrders(+restaurantId);
    return {
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(+id);
    return {
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    this.validateAdminKey(adminKey);
    const order = await this.orderService.updateStatus(+id, updateStatusDto.status);
    return {
      message: 'Order status updated successfully',
      data: order,
    };
  }

  @Get('shipping-manager/zone/:zone')
  @ApiOperation({ summary: 'Get orders by zone (Shipping Manager)' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrdersByZone(
    @Headers('shipping-manager-token') token: string,
    @Param('zone') zone: string,
    @Query('status') status?: string,
  ) {
    try {
      const manager = await this.shippingManagerService.findByToken(token);
      if (!manager) {
        throw new UnauthorizedException('Invalid shipping manager token');
      }
      
      // Verify manager zone matches requested zone
      const zoneNumber = parseInt(zone);
      if (manager.zone !== zoneNumber) {
        throw new UnauthorizedException('You can only access orders from your assigned zone');
      }
      
      const orders = await this.orderService.findByZone(zoneNumber, status);
      console.log(`[OrderController] Found ${orders.length} orders for zone ${zoneNumber}${status ? ` with status ${status}` : ''}`);
      
      return {
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('[OrderController] Error getting orders by zone:', error);
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }

  @Get('shipping-manager/my-orders')
  @ApiOperation({ summary: 'Get orders assigned to shipping manager' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyShippingManagerOrders(
    @Headers('shipping-manager-token') token: string,
    @Query('status') status?: string,
  ) {
    try {
      const manager = await this.shippingManagerService.findByToken(token);
      const orders = await this.orderService.findByShippingManager(manager.id, status);
      return {
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }

  @Patch('shipping-manager/:id/status')
  @ApiOperation({ summary: 'Update order status (Shipping Manager)' })
  @ApiHeader({ name: 'shipping-manager-token', required: true })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Order not in your zone' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatusByShippingManager(
    @Headers('shipping-manager-token') token: string,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    try {
      const manager = await this.shippingManagerService.findByToken(token);
      const order = await this.orderService.findOne(+id);
      
      // Verify order is in shipping manager's zone
      if (order.deliveryZone !== manager.zone) {
        throw new UnauthorizedException('You can only update orders from your assigned zone');
      }
      
      const updatedOrder = await this.orderService.updateStatus(+id, updateStatusDto.status);
      return {
        message: 'Order status updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid shipping manager token');
    }
  }
}

