import { DataSource } from 'typeorm';
export declare class OngkirService {
    private dataSource;
    constructor(dataSource: DataSource);
    getCities(province?: string, search?: string): Promise<any>;
    getCityById(id: number): Promise<any>;
    getZoneTariff(zoneFrom: number, zoneTo: number, serviceId: number): Promise<any>;
    getAllZoneTariffs(): Promise<any>;
    calculateOngkirByZone(originCityId: number, destCityId: number, serviceId: number, weight: number): Promise<{
        originCity: {
            id: any;
            name: any;
            province: any;
            zone: any;
        };
        destCity: {
            id: any;
            name: any;
            province: any;
            zone: any;
        };
        service: {
            id: any;
            name: any;
            estimasi: any;
        };
        weight: number;
        baseTariff: any;
        subtotal: number;
        serviceMultiplier: any;
        total: number;
    }>;
    getProvinces(): Promise<any>;
    createCity(data: {
        province: string;
        name: string;
        type: string;
        postalCode: string;
        multiplier?: number;
        zone?: number;
    }): Promise<any>;
    updateCity(id: number, data: {
        province?: string;
        name?: string;
        type?: string;
        postalCode?: string;
        multiplier?: number;
        zone?: number;
        status?: string;
    }): Promise<any>;
    deleteCity(id: number): Promise<void>;
    getServices(): Promise<any>;
    getServiceById(id: number): Promise<any>;
    createService(data: {
        name: string;
        description: string;
        estimasi: string;
        baseRate: number;
        multiplier: number;
    }): Promise<any>;
    updateService(id: number, data: {
        name?: string;
        description?: string;
        estimasi?: string;
        baseRate?: number;
        multiplier?: number;
        status?: string;
    }): Promise<any>;
    deleteService(id: number): Promise<void>;
    getPricingRules(): Promise<any>;
    createPricingRule(data: {
        cityFromId: number;
        cityToId: number;
        serviceId: number;
        ratePerKg: number;
        minWeight: number;
    }): Promise<any>;
    updatePricingRule(id: number, data: {
        cityFromId?: number;
        cityToId?: number;
        serviceId?: number;
        ratePerKg?: number;
        minWeight?: number;
        status?: string;
    }): Promise<any>;
    deletePricingRule(id: number): Promise<void>;
    calculateShipping(params: {
        cityFromId?: number;
        cityToId?: number;
        serviceId?: number;
        weight: number;
        distance?: number;
        zoneId?: number;
    }): Promise<{
        total: number;
        basePrice: any;
        distanceCost: number;
        serviceMultiplier: number;
        zoneMultiplier: number;
        zoneName: string;
        serviceName: any;
        estimasi: any;
        weight: number;
    }>;
}
