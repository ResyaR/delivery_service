import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  private readonly ADMIN_KEY = 'resya123@';

  constructor(private readonly restaurantService: RestaurantService) {}

  private validateAdminKey(adminKey: string): void {
    if (adminKey !== this.ADMIN_KEY) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create restaurant (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Headers('admin-key') adminKey: string,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    this.validateAdminKey(adminKey);
    const restaurant = await this.restaurantService.create(createRestaurantDto);
    return {
      message: 'Restaurant created successfully',
      data: restaurant,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
  @ApiQuery({ name: 'city', required: false, description: 'Filter restaurants by city name' })
  @ApiResponse({ status: 200, description: 'Restaurants retrieved successfully' })
  async findAll(@Query('status') status?: string, @Query('city') city?: string) {
    const restaurants = await this.restaurantService.findAll(status, city);
    return {
      message: 'Restaurants retrieved successfully',
      data: restaurants,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findOne(+id);
    return {
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Restaurant updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async update(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    this.validateAdminKey(adminKey);
    const restaurant = await this.restaurantService.update(+id, updateRestaurantDto);
    return {
      message: 'Restaurant updated successfully',
      data: restaurant,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Restaurant deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async remove(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
  ) {
    this.validateAdminKey(adminKey);
    await this.restaurantService.remove(+id);
    return {
      message: 'Restaurant deleted successfully',
    };
  }
}

