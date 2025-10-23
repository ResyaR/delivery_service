import 'dotenv/config';
import { DataSource } from 'typeorm';
import { assignZonesToCities } from '../ongkir/seeders/assign-zones';

const dataSource = new DataSource({
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

    await assignZonesToCities(dataSource);

    await dataSource.destroy();
    console.log('\n👋 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

run();

