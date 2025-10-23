import { DataSource } from 'typeorm';
import { indonesiaCities } from './cities.seeder';

export async function seedCities(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('🌆 Starting cities seeding...');

    // Clear existing data and reset sequence
    try {
      await queryRunner.query('TRUNCATE TABLE ongkir_cities RESTART IDENTITY CASCADE');
      console.log('✅ Cleared existing cities and reset ID');
    } catch (error) {
      await queryRunner.query('DELETE FROM ongkir_cities');
      console.log('✅ Cleared existing cities');
    }

    // Ensure sequence exists
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
    } catch (e) {
      // Sequence might already exist
    }

    // Insert cities
    for (const city of indonesiaCities) {
      await queryRunner.query(
        `INSERT INTO ongkir_cities (id, province, name, type, postal_code, multiplier, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [
          city.id,
          city.province,
          city.name,
          city.type,
          city.postalCode,
          city.multiplier,
          'active'
        ]
      );
    }

    // Update sequence for future inserts
    try {
      const maxId = Math.max(...indonesiaCities.map(c => c.id));
      await queryRunner.query(`SELECT setval('ongkir_cities_id_seq', ${maxId + 1}, false)`);
    } catch (e) {
      // Ignore
    }

    await queryRunner.commitTransaction();
    console.log(`✅ Successfully seeded ${indonesiaCities.length} cities`);
    console.log('📊 Cities by province:');
    
    const citiesByProvince = indonesiaCities.reduce((acc, city) => {
      acc[city.province] = (acc[city.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(citiesByProvince).forEach(([province, count]) => {
      console.log(`   ${province}: ${count} cities`);
    });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error seeding cities:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

