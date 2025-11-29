import { OngkirService } from './ongkir.service';
export declare class OngkirController {
    private readonly ongkirService;
    constructor(ongkirService: OngkirService);
    getCities(province?: string, search?: string): Promise<{
        message: string;
        data: any;
    }>;
    getCityById(id: number): Promise<{
        message: string;
        data: any;
    }>;
    createCity(body: {
        province: string;
        name: string;
        type: string;
        postalCode: string;
        multiplier?: number;
        zone?: number;
    }): Promise<{
        message: string;
        data: any;
    }>;
    updateCity(id: number, body: {
        province?: string;
        name?: string;
        type?: string;
        postalCode?: string;
        multiplier?: number;
        zone?: number;
        status?: string;
    }): Promise<{
        message: string;
        data: any;
    }>;
    deleteCity(id: number): Promise<{
        message: string;
    }>;
    getProvinces(): Promise<{
        message: string;
        data: any;
    }>;
    getServices(): Promise<{
        message: string;
        data: any;
    }>;
    getServiceById(id: number): Promise<{
        message: string;
        data: any;
    }>;
    createService(body: {
        name: string;
        description: string;
        estimasi: string;
        baseRate: number;
        multiplier: number;
    }): Promise<{
        message: string;
        data: any;
    }>;
    updateService(id: number, body: {
        name?: string;
        description?: string;
        estimasi?: string;
        baseRate?: number;
        multiplier?: number;
        status?: string;
    }): Promise<{
        message: string;
        data: any;
    }>;
    deleteService(id: number): Promise<{
        message: string;
    }>;
    getPricingRules(): Promise<{
        message: string;
        data: any;
    }>;
    createPricingRule(body: {
        cityFromId: number;
        cityToId: number;
        serviceId: number;
        ratePerKg: number;
        minWeight: number;
    }): Promise<{
        message: string;
        data: any;
    }>;
    updatePricingRule(id: number, body: {
        cityFromId?: number;
        cityToId?: number;
        serviceId?: number;
        ratePerKg?: number;
        minWeight?: number;
        status?: string;
    }): Promise<{
        message: string;
        data: any;
    }>;
    deletePricingRule(id: number): Promise<{
        message: string;
    }>;
    getZones(province?: string): Promise<{
        message: string;
        data: any;
    }>;
    calculateShipping(body: {
        cityFromId?: number;
        cityToId?: number;
        serviceId?: number;
        weight: number;
        distance?: number;
        zoneId?: number;
    }): Promise<{
        message: string;
        data: {
            total: number;
            basePrice: any;
            distanceCost: number;
            serviceMultiplier: number;
            zoneMultiplier: number;
            zoneName: string;
            serviceName: any;
            estimasi: any;
            weight: number;
        };
    }>;
    calculateByZone(body: {
        originCityId: number;
        destCityId: number;
        serviceId: number;
        weight: number;
    }): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getAllZoneTariffs(): Promise<{
        message: string;
        data: any;
    }>;
    getZoneTariff(zoneFrom: number, zoneTo: number, serviceId: number): Promise<{
        message: string;
        data: any;
    }>;
}
