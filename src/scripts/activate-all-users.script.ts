import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

async function activateAllUsers() {
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

    console.log('\n🔄 Activating all users (setting lastLogin)...');
    
    // Get all users
    const users = await dataSource.query('SELECT id, "createdAt" FROM "user" ORDER BY id ASC');
    
    if (users.length === 0) {
      console.log('⚠️  No users found!');
      return;
    }

    console.log(`Found ${users.length} users`);
    
    // Set lastLogin for all users (1-3 days after registration)
    for (const user of users) {
      const createdAt = new Date(user.createdAt);
      const lastLogin = new Date(createdAt);
      
      // Random 1-3 days after registration
      lastLogin.setDate(lastLogin.getDate() + Math.floor(Math.random() * 3) + 1);
      lastLogin.setHours(Math.floor(Math.random() * 24));
      lastLogin.setMinutes(Math.floor(Math.random() * 60));
      
      await dataSource.query(
        'UPDATE "user" SET "lastLogin" = $1 WHERE id = $2',
        [lastLogin, user.id]
      );
      
      console.log(`   ✓ User ${user.id}: Last login set to ${lastLogin.toLocaleString('id-ID')}`);
    }
    
    console.log('\n✅ All users activated successfully!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

activateAllUsers()
  .then(() => {
    console.log('👋 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

