import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OngkirService } from './ongkir.service';

@ApiTags('ongkir')
@Controller('ongkir')
export class OngkirController {
  constructor(private readonly ongkirService: OngkirService) {}

  // ============== CITIES ==============
  
  @Get('cities')
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async getCities(@Query('province') province?: string) {
    const cities = await this.ongkirService.getCities(province);
    return {
      message: 'Cities fetched successfully',
      data: cities,
    };
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get city by ID' })
  async getCityById(@Param('id') id: number) {
    const city = await this.ongkirService.getCityById(id);
    return {
      message: 'City fetched successfully',
      data: city,
    };
  }

  @Post('cities')
  @ApiOperation({ summary: 'Create new city' })
  async createCity(@Body() body: {
    province: string;
    name: string;
    type: string;
    postalCode: string;
    multiplier: number;
  }) {
    const city = await this.ongkirService.createCity(body);
    return {
      message: 'City created successfully',
      data: city,
    };
  }

  @Put('cities/:id')
  @ApiOperation({ summary: 'Update city' })
  async updateCity(@Param('id') id: number, @Body() body: {
    province?: string;
    name?: string;
    type?: string;
    postalCode?: string;
    multiplier?: number;
    status?: string;
  }) {
    const city = await this.ongkirService.updateCity(id, body);
    return {
      message: 'City updated successfully',
      data: city,
    };
  }

  @Delete('cities/:id')
  @ApiOperation({ summary: 'Delete city' })
  async deleteCity(@Param('id') id: number) {
    await this.ongkirService.deleteCity(id);
    return {
      message: 'City deleted successfully',
    };
  }

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
  async getProvinces() {
    const provinces = await this.ongkirService.getProvinces();
    return {
      message: 'Provinces fetched successfully',
      data: provinces,
    };
  }

  // ============== SERVICES ==============
  
  @Get('services')
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices() {
    const services = await this.ongkirService.getServices();
    return {
      message: 'Services fetched successfully',
      data: services,
    };
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  async getServiceById(@Param('id') id: number) {
    const service = await this.ongkirService.getServiceById(id);
    return {
      message: 'Service fetched successfully',
      data: service,
    };
  }

  @Post('services')
  @ApiOperation({ summary: 'Create new service' })
  async createService(@Body() body: {
    name: string;
    description: string;
    estimasi: string;
    baseRate: number;
    multiplier: number;
  }) {
    const service = await this.ongkirService.createService(body);
    return {
      message: 'Service created successfully',
      data: service,
    };
  }

  @Put('services/:id')
  @ApiOperation({ summary: 'Update service' })
  async updateService(@Param('id') id: number, @Body() body: {
    name?: string;
    description?: string;
    estimasi?: string;
    baseRate?: number;
    multiplier?: number;
    status?: string;
  }) {
    const service = await this.ongkirService.updateService(id, body);
    return {
      message: 'Service updated successfully',
      data: service,
    };
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete service' })
  async deleteService(@Param('id') id: number) {
    await this.ongkirService.deleteService(id);
    return {
      message: 'Service deleted successfully',
    };
  }

  // ============== PRICING ==============
  
  @Get('pricing-rules')
  @ApiOperation({ summary: 'Get all pricing rules' })
  async getPricingRules() {
    const rules = await this.ongkirService.getPricingRules();
    return {
      message: 'Pricing rules fetched successfully',
      data: rules,
    };
  }

  @Post('pricing-rules')
  @ApiOperation({ summary: 'Create new pricing rule' })
  async createPricingRule(@Body() body: {
    cityFromId: number;
    cityToId: number;
    serviceId: number;
    ratePerKg: number;
    minWeight: number;
  }) {
    const rule = await this.ongkirService.createPricingRule(body);
    return {
      message: 'Pricing rule created successfully',
      data: rule,
    };
  }

  @Put('pricing-rules/:id')
  @ApiOperation({ summary: 'Update pricing rule' })
  async updatePricingRule(@Param('id') id: number, @Body() body: {
    cityFromId?: number;
    cityToId?: number;
    serviceId?: number;
    ratePerKg?: number;
    minWeight?: number;
    status?: string;
  }) {
    const rule = await this.ongkirService.updatePricingRule(id, body);
    return {
      message: 'Pricing rule updated successfully',
      data: rule,
    };
  }

  @Delete('pricing-rules/:id')
  @ApiOperation({ summary: 'Delete pricing rule' })
  async deletePricingRule(@Param('id') id: number) {
    await this.ongkirService.deletePricingRule(id);
    return {
      message: 'Pricing rule deleted successfully',
    };
  }

  @Get('zones')
  @ApiOperation({ summary: 'Get delivery zones (alias for cities)' })
  async getZones(@Query('province') province?: string) {
    const zones = await this.ongkirService.getCities(province);
    return {
      message: 'Zones fetched successfully',
      data: zones,
    };
  }

  // ============== CALCULATE ==============
  
  @Post('calculate')
  @ApiOperation({ summary: 'Calculate shipping cost' })
  async calculateShipping(
    @Body() body: {
      cityFromId?: number;
      cityToId?: number;
      serviceId?: number;
      weight: number;
      distance?: number;
      zoneId?: number;
    },
  ) {
    const result = await this.ongkirService.calculateShipping(body);
    return {
      message: 'Shipping cost calculated successfully',
      data: result,
    };
  }

  @Post('calculate-zone')
  @ApiOperation({ summary: 'Calculate shipping cost based on zone tariff' })
  @ApiResponse({ status: 200, description: 'Shipping cost calculated' })
  async calculateByZone(
    @Body() body: {
      originCityId: number;
      destCityId: number;
      serviceId: number;
      weight: number;
    },
  ) {
    const result = await this.ongkirService.calculateOngkirByZone(
      body.originCityId,
      body.destCityId,
      body.serviceId,
      body.weight,
    );
    return {
      message: 'Shipping cost calculated successfully',
      data: result,
    };
  }

  // ============== ZONE TARIFFS ==============

  @Get('zone-tariffs')
  @ApiOperation({ summary: 'Get all zone tariffs' })
  async getAllZoneTariffs() {
    const tariffs = await this.ongkirService.getAllZoneTariffs();
    return {
      message: 'Zone tariffs fetched successfully',
      data: tariffs,
    };
  }

  @Get('zone-tariff/:zoneFrom/:zoneTo/:serviceId')
  @ApiOperation({ summary: 'Get zone tariff by zones and service' })
  async getZoneTariff(
    @Param('zoneFrom') zoneFrom: number,
    @Param('zoneTo') zoneTo: number,
    @Param('serviceId') serviceId: number,
  ) {
    const tariff = await this.ongkirService.getZoneTariff(zoneFrom, zoneTo, serviceId);
    return {
      message: 'Zone tariff fetched successfully',
      data: tariff,
    };
  }
}

