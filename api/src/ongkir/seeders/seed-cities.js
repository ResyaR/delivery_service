"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCities = seedCities;
const cities_seeder_1 = require("./cities.seeder");
async function seedCities(dataSource) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        console.log('🌆 Starting cities seeding...');
        try {
            await queryRunner.query('TRUNCATE TABLE ongkir_cities RESTART IDENTITY CASCADE');
            console.log('✅ Cleared existing cities and reset ID');
        }
        catch (error) {
            await queryRunner.query('DELETE FROM ongkir_cities');
            console.log('✅ Cleared existing cities');
        }
        try {
            await queryRunner.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ongkir_cities_id_seq') THEN
            CREATE SEQUENCE ongkir_cities_id_seq;
            ALTER TABLE ongkir_cities ALTER COLUMN id SET DEFAULT nextval('ongkir_cities_id_seq');
          END IF;
        END $$;
      `);
            await queryRunner.query(`SELECT setval('ongkir_cities_id_seq', 1, false)`);
        }
        catch (e) {
        }
        for (const city of cities_seeder_1.indonesiaCities) {
            await queryRunner.query(`INSERT INTO ongkir_cities (id, province, name, type, postal_code, multiplier, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`, [
                city.id,
                city.province,
                city.name,
                city.type,
                city.postalCode,
                city.multiplier,
                'active'
            ]);
        }
        try {
            const maxId = Math.max(...cities_seeder_1.indonesiaCities.map(c => c.id));
            await queryRunner.query(`SELECT setval('ongkir_cities_id_seq', ${maxId + 1}, false)`);
        }
        catch (e) {
        }
        await queryRunner.commitTransaction();
        console.log(`✅ Successfully seeded ${cities_seeder_1.indonesiaCities.length} cities`);
        console.log('📊 Cities by province:');
        const citiesByProvince = cities_seeder_1.indonesiaCities.reduce((acc, city) => {
            acc[city.province] = (acc[city.province] || 0) + 1;
            return acc;
        }, {});
        Object.entries(citiesByProvince).forEach(([province, count]) => {
            console.log(`   ${province}: ${count} cities`);
        });
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Error seeding cities:', error);
        throw error;
    }
    finally {
        await queryRunner.release();
    }
}
//# sourceMappingURL=seed-cities.js.map