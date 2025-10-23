"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const seed_all_cities_1 = require("../ongkir/seeders/seed-all-cities");
const seed_services_1 = require("../ongkir/seeders/seed-services");
(0, dotenv_1.config)();
async function run() {
    console.log('🔧 Environment variables loaded');
    console.log('📍 DB_HOST:', process.env.DB_HOST);
    console.log('📍 DB_USERNAME:', process.env.DB_USERNAME);
    console.log('📍 DB_DATABASE:', process.env.DB_DATABASE);
    console.log('');
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
    });
    try {
        await dataSource.initialize();
        console.log('📦 Database connected');
        console.log('==========================================');
        await (0, seed_all_cities_1.seedAllCities)(dataSource);
        console.log('==========================================');
        await (0, seed_services_1.seedServices)(dataSource);
        console.log('==========================================');
        console.log('✨ All seeders completed successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
    finally {
        await dataSource.destroy();
        console.log('👋 Database connection closed');
    }
}
run();
//# sourceMappingURL=seed-all.script.js.map