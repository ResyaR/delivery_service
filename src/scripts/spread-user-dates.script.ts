import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function spreadUserDates() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'food_delivery',
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: false,
  });
  
  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected!');

    console.log('\n📅 Spreading user registration dates (for demo)...');
    
    // Get all users
    const users = await dataSource.query('SELECT id FROM "user" ORDER BY id ASC');
    
    if (users.length === 0) {
      console.log('⚠️  No users found!');
      return;
    }

    console.log(`Found ${users.length} users`);
    
    // Spread users across last 7 days
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const daysAgo = Math.floor(Math.random() * 7); // Random day in last 7 days
      const hoursAgo = Math.floor(Math.random() * 24); // Random hour
      
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(createdAt.getHours() - hoursAgo);
      
      await dataSource.query(
        'UPDATE "user" SET "createdAt" = $1 WHERE id = $2',
        [createdAt, user.id]
      );
      
      console.log(`   ✓ User ${user.id}: ${createdAt.toDateString()} ${createdAt.toLocaleTimeString()}`);
    }
    
    console.log('\n✅ User dates spread successfully!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

spreadUserDates()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

