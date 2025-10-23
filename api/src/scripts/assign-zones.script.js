"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const assign_zones_1 = require("../ongkir/seeders/assign-zones");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'food_delivery',
    synchronize: false,
});
async function run() {
    try {
        console.log('🔌 Connecting to database...');
        await dataSource.initialize();
        console.log('✅ Connected!\n');
        await (0, assign_zones_1.assignZonesToCities)(dataSource);
        await dataSource.destroy();
        console.log('\n👋 Done!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
run();
//# sourceMappingURL=assign-zones.script.js.map