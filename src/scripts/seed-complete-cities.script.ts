import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { seedAllCities } from '../ongkir/seeders/seed-all-cities';

// Load .env file
config();

async function run() {
  console.log('🔧 Environment variables loaded');
  console.log('📍 DB_HOST:', process.env.DB_HOST);
  console.log('📍 DB_USERNAME:', process.env.DB_USERNAME);
  console.log('📍 DB_DATABASE:', process.env.DB_DATABASE);
  console.log('');

  // Setup database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'food_delivery',
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connected');
    console.log('==========================================');

    // Seed all cities (Kota + Kabupaten)
    await seedAllCities(dataSource);
    console.log('==========================================');

    console.log('\n✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('👋 Database connection closed');
  }
}

run();

