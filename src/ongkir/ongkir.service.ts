import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OngkirService {
  constructor(private dataSource: DataSource) {}

  // ============== CITIES ==============

  async getCities(province?: string) {
    let query = `
      SELECT id, province, name, type, postal_code as "postalCode", 
             multiplier, zone, status, created_at as "createdAt", updated_at as "updatedAt"
      FROM ongkir_cities
      WHERE status = 'active'
    `;

    const params: any[] = [];
    
    if (province) {
      query += ` AND province = $1`;
      params.push(province);
    }

    query += ` ORDER BY province, name`;

    const cities = await this.dataSource.query(query, params);
    return cities;
  }

  async getCityById(id: number) {
    const city = await this.dataSource.query(
      `SELECT id, province, name, type, postal_code as "postalCode", 
              multiplier, zone, status, created_at as "createdAt", updated_at as "updatedAt"
       FROM ongkir_cities
       WHERE id = $1`,
      [id],
    );
    return city[0];
  }

  // ============== ZONE TARIFFS ==============

  async getZoneTariff(zoneFrom: number, zoneTo: number, serviceId: number) {
    const tariff = await this.dataSource.query(
      `SELECT id, zone_from as "zoneFrom", zone_to as "zoneTo", 
              service_id as "serviceId", base_tariff as "baseTariff", status
       FROM ongkir_zone_tariffs
       WHERE zone_from = $1 AND zone_to = $2 AND service_id = $3 AND status = 'active'`,
      [zoneFrom, zoneTo, serviceId],
    );
    return tariff[0];
  }

  async getAllZoneTariffs() {
    const tariffs = await this.dataSource.query(
      `SELECT t.id, t.zone_from as "zoneFrom", t.zone_to as "zoneTo", 
              t.service_id as "serviceId", s.name as "serviceName",
              t.base_tariff as "baseTariff", t.status
       FROM ongkir_zone_tariffs t
       JOIN ongkir_services s ON t.service_id = s.id
       WHERE t.status = 'active'
       ORDER BY t.zone_from, t.zone_to, t.service_id`
    );
    return tariffs;
  }

  async calculateOngkirByZone(
    originCityId: number,
    destCityId: number,
    serviceId: number,
    weight: number,
  ) {
    // Get cities with zones
    const originCity = await this.getCityById(originCityId);
    const destCity = await this.getCityById(destCityId);

    if (!originCity || !destCity) {
      throw new Error('City not found');
    }

    if (!originCity.zone || !destCity.zone) {
      throw new Error('City zone not configured');
    }

    // Get zone tariff
    const zoneTariff = await this.getZoneTariff(
      originCity.zone,
      destCity.zone,
      serviceId,
    );

    if (!zoneTariff) {
      throw new Error('Zone tariff not found');
    }

    // Get service info
    const service = await this.getServiceById(serviceId);

    // Calculate
    const baseTariff = zoneTariff.baseTariff;
    const subtotal = baseTariff * weight;
    
    // Apply service multiplier
    const serviceMultiplier = service?.multiplier || 1;
    const total = subtotal * serviceMultiplier;

    return {
      originCity: {
        id: originCity.id,
        name: originCity.name,
        province: originCity.province,
        zone: originCity.zone,
      },
      destCity: {
        id: destCity.id,
        name: destCity.name,
        province: destCity.province,
        zone: destCity.zone,
      },
      service: {
        id: service.id,
        name: service.name,
        estimasi: service.estimasi,
      },
      weight,
      baseTariff,
      subtotal,
      serviceMultiplier,
      total: Math.round(total),
    };
  }

  async getProvinces() {
    const result = await this.dataSource.query(
      `SELECT DISTINCT province
       FROM ongkir_cities
       WHERE status = 'active'
       ORDER BY province`,
    );
    return result.map((r) => r.province);
  }

  async createCity(data: {
    province: string;
    name: string;
    type: string;
    postalCode: string;
    multiplier: number;
  }) {
    const result = await this.dataSource.query(
      `INSERT INTO ongkir_cities (province, name, type, postal_code, multiplier, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, province, name, type, postal_code as "postalCode", 
                 multiplier, status, created_at as "createdAt", updated_at as "updatedAt"`,
      [data.province, data.name, data.type, data.postalCode, data.multiplier],
    );
    return result[0];
  }

  async updateCity(id: number, data: {
    province?: string;
    name?: string;
    type?: string;
    postalCode?: string;
    multiplier?: number;
    status?: string;
  }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.province !== undefined) {
      fields.push(`province = $${paramCount++}`);
      values.push(data.province);
    }
    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.type !== undefined) {
      fields.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.postalCode !== undefined) {
      fields.push(`postal_code = $${paramCount++}`);
      values.push(data.postalCode);
    }
    if (data.multiplier !== undefined) {
      fields.push(`multiplier = $${paramCount++}`);
      values.push(data.multiplier);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.dataSource.query(
      `UPDATE ongkir_cities 
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, province, name, type, postal_code as "postalCode", 
                 multiplier, status, created_at as "createdAt", updated_at as "updatedAt"`,
      values,
    );
    return result[0];
  }

  async deleteCity(id: number) {
    await this.dataSource.query(
      `DELETE FROM ongkir_cities WHERE id = $1`,
      [id],
    );
  }

  // ============== SERVICES ==============

  async getServices() {
    const services = await this.dataSource.query(
      `SELECT id, name, description, estimasi, base_rate as "baseRate", 
              multiplier, status, created_at as "createdAt", updated_at as "updatedAt"
       FROM ongkir_services
       WHERE status = 'active'
       ORDER BY base_rate`,
    );
    return services;
  }

  async getServiceById(id: number) {
    const service = await this.dataSource.query(
      `SELECT id, name, description, estimasi, base_rate as "baseRate", 
              multiplier, status, created_at as "createdAt", updated_at as "updatedAt"
       FROM ongkir_services
       WHERE id = $1`,
      [id],
    );
    return service[0];
  }

  async createService(data: {
    name: string;
    description: string;
    estimasi: string;
    baseRate: number;
    multiplier: number;
  }) {
    const result = await this.dataSource.query(
      `INSERT INTO ongkir_services (name, description, estimasi, base_rate, multiplier, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, name, description, estimasi, base_rate as "baseRate", 
                 multiplier, status, created_at as "createdAt", updated_at as "updatedAt"`,
      [data.name, data.description, data.estimasi, data.baseRate, data.multiplier],
    );
    return result[0];
  }

  async updateService(id: number, data: {
    name?: string;
    description?: string;
    estimasi?: string;
    baseRate?: number;
    multiplier?: number;
    status?: string;
  }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.estimasi !== undefined) {
      fields.push(`estimasi = $${paramCount++}`);
      values.push(data.estimasi);
    }
    if (data.baseRate !== undefined) {
      fields.push(`base_rate = $${paramCount++}`);
      values.push(data.baseRate);
    }
    if (data.multiplier !== undefined) {
      fields.push(`multiplier = $${paramCount++}`);
      values.push(data.multiplier);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.dataSource.query(
      `UPDATE ongkir_services 
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, name, description, estimasi, base_rate as "baseRate", 
                 multiplier, status, created_at as "createdAt", updated_at as "updatedAt"`,
      values,
    );
    return result[0];
  }

  async deleteService(id: number) {
    await this.dataSource.query(
      `DELETE FROM ongkir_services WHERE id = $1`,
      [id],
    );
  }

  // ============== PRICING ==============

  async getPricingRules() {
    const rules = await this.dataSource.query(
      `SELECT p.id, 
              p.city_from_id as "cityFromId", p.city_to_id as "cityToId", p.service_id as "serviceId",
              cf.name as "kotaAsal", ct.name as "kotaTujuan",
              s.name as "layanan", s.estimasi,
              p.rate_per_kg as "pricePerKg", p.min_weight as "minWeight",
              p.status, p.created_at as "createdAt", p.updated_at as "updatedAt"
       FROM ongkir_pricing p
       JOIN ongkir_cities cf ON p.city_from_id = cf.id
       JOIN ongkir_cities ct ON p.city_to_id = ct.id
       JOIN ongkir_services s ON p.service_id = s.id
       WHERE p.status = 'active'
       ORDER BY cf.name, ct.name, s.base_rate`,
    );
    return rules;
  }

  async createPricingRule(data: {
    cityFromId: number;
    cityToId: number;
    serviceId: number;
    ratePerKg: number;
    minWeight: number;
  }) {
    const result = await this.dataSource.query(
      `INSERT INTO ongkir_pricing (city_from_id, city_to_id, service_id, rate_per_kg, min_weight, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, city_from_id as "cityFromId", city_to_id as "cityToId", 
                 service_id as "serviceId", rate_per_kg as "ratePerKg", min_weight as "minWeight",
                 status, created_at as "createdAt", updated_at as "updatedAt"`,
      [data.cityFromId, data.cityToId, data.serviceId, data.ratePerKg, data.minWeight],
    );
    return result[0];
  }

  async updatePricingRule(id: number, data: {
    cityFromId?: number;
    cityToId?: number;
    serviceId?: number;
    ratePerKg?: number;
    minWeight?: number;
    status?: string;
  }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.cityFromId !== undefined) {
      fields.push(`city_from_id = $${paramCount++}`);
      values.push(data.cityFromId);
    }
    if (data.cityToId !== undefined) {
      fields.push(`city_to_id = $${paramCount++}`);
      values.push(data.cityToId);
    }
    if (data.serviceId !== undefined) {
      fields.push(`service_id = $${paramCount++}`);
      values.push(data.serviceId);
    }
    if (data.ratePerKg !== undefined) {
      fields.push(`rate_per_kg = $${paramCount++}`);
      values.push(data.ratePerKg);
    }
    if (data.minWeight !== undefined) {
      fields.push(`min_weight = $${paramCount++}`);
      values.push(data.minWeight);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await this.dataSource.query(
      `UPDATE ongkir_pricing 
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, city_from_id as "cityFromId", city_to_id as "cityToId", 
                 service_id as "serviceId", rate_per_kg as "ratePerKg", min_weight as "minWeight",
                 status, created_at as "createdAt", updated_at as "updatedAt"`,
      values,
    );
    return result[0];
  }

  async deletePricingRule(id: number) {
    await this.dataSource.query(
      `DELETE FROM ongkir_pricing WHERE id = $1`,
      [id],
    );
  }

  // ============== CALCULATE ==============

  async calculateShipping(params: {
    cityFromId?: number;
    cityToId?: number;
    serviceId?: number;
    weight: number;
    distance?: number;
    zoneId?: number;
  }) {
    const { cityFromId, cityToId, serviceId, weight, distance, zoneId } = params;

    // Get service info
    let service: any;
    if (serviceId) {
      service = await this.getServiceById(serviceId);
    } else {
      // Default to Reguler service
      const services = await this.getServices();
      service = services.find((s) => s.name === 'Reguler') || services[0];
    }

    // Get city info (for multiplier)
    let cityMultiplier = 1.0;
    let zoneName = '';

    if (cityToId) {
      const city = await this.getCityById(cityToId);
      if (city) {
        cityMultiplier = parseFloat(city.multiplier);
        zoneName = city.name;
      }
    } else if (zoneId) {
      const city = await this.getCityById(zoneId);
      if (city) {
        cityMultiplier = parseFloat(city.multiplier);
        zoneName = city.name;
      }
    }

    // Calculate
    const basePrice = service.baseRate;
    const serviceMultiplier = parseFloat(service.multiplier);
    const distanceCost = basePrice * weight;
    const zoneMultiplier = cityMultiplier;
    
    const total = Math.round(distanceCost * serviceMultiplier * cityMultiplier);

    return {
      total,
      basePrice,
      distanceCost: Math.round(distanceCost),
      serviceMultiplier,
      zoneMultiplier,
      zoneName,
      serviceName: service.name,
      estimasi: service.estimasi,
      weight,
    };
  }
}

