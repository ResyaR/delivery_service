"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedServices = seedServices;
const services_seeder_1 = require("./services.seeder");
async function seedServices(dataSource) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        console.log('🚚 Starting services seeding...');
        try {
            await queryRunner.query('TRUNCATE TABLE ongkir_services RESTART IDENTITY CASCADE');
            console.log('✅ Cleared existing services and reset ID');
        }
        catch (error) {
            await queryRunner.query('DELETE FROM ongkir_services');
            console.log('✅ Cleared existing services');
        }
        try {
            await queryRunner.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ongkir_services_id_seq') THEN
            CREATE SEQUENCE ongkir_services_id_seq;
            ALTER TABLE ongkir_services ALTER COLUMN id SET DEFAULT nextval('ongkir_services_id_seq');
          END IF;
        END $$;
      `);
            await queryRunner.query(`SELECT setval('ongkir_services_id_seq', 1, false)`);
        }
        catch (e) {
        }
        for (const service of services_seeder_1.defaultServices) {
            await queryRunner.query(`INSERT INTO ongkir_services (id, name, description, estimasi, base_rate, multiplier, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`, [
                service.id,
                service.name,
                service.description,
                service.estimasi,
                service.baseRate,
                service.multiplier,
                service.status,
            ]);
        }
        await queryRunner.commitTransaction();
        console.log(`✅ Successfully seeded ${services_seeder_1.defaultServices.length} services`);
        console.log('📦 Services:');
        services_seeder_1.defaultServices.forEach((service) => {
            console.log(`   ${service.name} - Rp ${service.baseRate.toLocaleString('id-ID')}/kg (${service.estimasi})`);
        });
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Error seeding services:', error);
        throw error;
    }
    finally {
        await queryRunner.release();
    }
}
//# sourceMappingURL=seed-services.js.map