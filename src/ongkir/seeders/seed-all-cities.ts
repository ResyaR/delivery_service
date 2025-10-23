import { DataSource } from 'typeorm';
import { completeIndonesiaCities } from './complete-cities.seeder';

export async function seedAllCities(dataSource: DataSource) {
  console.log('🗑️  Clearing existing cities data...');
  
  // Use TRUNCATE to delete and reset ID automatically
  try {
    await dataSource.query('TRUNCATE TABLE ongkir_cities RESTART IDENTITY CASCADE');
    console.log('✅ Cleared and reset ID sequence');
  } catch (error) {
    // Fallback: manual delete
    await dataSource.query('DELETE FROM ongkir_cities');
    console.log('✅ Cleared existing cities');
  }
  
  // Ensure sequence exists and is reset
  console.log('🔧 Setting up ID sequence...');
  try {
    // Create sequence if not exists
    await dataSource.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ongkir_cities_id_seq') THEN
          CREATE SEQUENCE ongkir_cities_id_seq;
          ALTER TABLE ongkir_cities ALTER COLUMN id SET DEFAULT nextval('ongkir_cities_id_seq');
        END IF;
      END $$;
    `);
    
    // Reset sequence to 1
    await dataSource.query(`SELECT setval('ongkir_cities_id_seq', 1, false)`);
    console.log('✅ Sequence ready');
  } catch (e) {
    console.log('⚠️  Using manual ID assignment');
  }
  
  console.log(`📦 Inserting ${completeIndonesiaCities.length} cities and kabupaten...`);
  
  let inserted = 0;
  for (let i = 0; i < completeIndonesiaCities.length; i++) {
    const city = completeIndonesiaCities[i];
    try {
      await dataSource.query(
        `INSERT INTO ongkir_cities (id, province, name, type, postal_code, multiplier, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [i + 1, city.province, city.name, city.type, city.postalCode, city.multiplier]
      );
      inserted++;
      
      if (inserted % 50 === 0) {
        console.log(`   ✓ Inserted ${inserted}/${completeIndonesiaCities.length} cities...`);
      }
    } catch (error) {
      console.error(`❌ Error inserting ${city.name}:`, error.message);
    }
  }
  
  console.log(`\n✅ Successfully inserted ${inserted} cities!`);
  
  // Update sequence to next available ID
  console.log('🔄 Updating sequence for future inserts...');
  try {
    await dataSource.query(`SELECT setval('ongkir_cities_id_seq', ${inserted + 1}, false)`);
  } catch (e) {
    // Ignore if sequence doesn't exist
  }
  
  // Statistics
  const kotaCount = await dataSource.query(`SELECT COUNT(*) as count FROM ongkir_cities WHERE type = 'Kota'`);
  const kabupatenCount = await dataSource.query(`SELECT COUNT(*) as count FROM ongkir_cities WHERE type = 'Kabupaten'`);
  const provinceCount = await dataSource.query(`SELECT COUNT(DISTINCT province) as count FROM ongkir_cities`);
  
  console.log('\n📊 Database Statistics:');
  console.log(`   🏙️  Total Kota: ${kotaCount[0].count}`);
  console.log(`   🏘️  Total Kabupaten: ${kabupatenCount[0].count}`);
  console.log(`   🗺️  Total Provinsi: ${provinceCount[0].count}`);
  console.log(`   📍 Total Wilayah: ${parseInt(kotaCount[0].count) + parseInt(kabupatenCount[0].count)}`);
}

