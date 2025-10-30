import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  private readonly ADMIN_KEY = 'resya123@';

  constructor(private readonly menuService: MenuService) {}

  private validateAdminKey(adminKey: string): void {
    if (adminKey !== this.ADMIN_KEY) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create menu item (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 201, description: 'Menu created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Headers('admin-key') adminKey: string,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    this.validateAdminKey(adminKey);
    const menu = await this.menuService.create(createMenuDto);
    return {
      message: 'Menu created successfully',
      data: menu,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus' })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiResponse({ status: 200, description: 'Menus retrieved successfully' })
  async findAll(@Query('restaurantId') restaurantId?: string) {
    const menus = await this.menuService.findAll(restaurantId ? +restaurantId : undefined);
    return {
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get menus by restaurant ID' })
  @ApiResponse({ status: 200, description: 'Menus retrieved successfully' })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    const menus = await this.menuService.findByRestaurant(+restaurantId);
    return {
      message: 'Menus retrieved successfully',
      data: menus,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  @ApiResponse({ status: 200, description: 'Menu retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async findOne(@Param('id') id: string) {
    const menu = await this.menuService.findOne(+id);
    return {
      message: 'Menu retrieved successfully',
      data: menu,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update menu (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Menu updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async update(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    this.validateAdminKey(adminKey);
    const menu = await this.menuService.update(+id, updateMenuDto);
    return {
      message: 'Menu updated successfully',
      data: menu,
    };
  }

  @Patch(':id/availability')
  @ApiOperation({ summary: 'Update menu availability (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Menu availability updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAvailability(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
    @Body('availability') availability: boolean,
  ) {
    this.validateAdminKey(adminKey);
    const menu = await this.menuService.updateAvailability(+id, availability);
    return {
      message: 'Menu availability updated',
      data: menu,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu (Admin only)' })
  @ApiHeader({ name: 'admin-key', required: true })
  @ApiResponse({ status: 200, description: 'Menu deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  async remove(
    @Headers('admin-key') adminKey: string,
    @Param('id') id: string,
  ) {
    this.validateAdminKey(adminKey);
    await this.menuService.remove(+id);
    return {
      message: 'Menu deleted successfully',
    };
  }
}

