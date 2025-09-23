import { createConnection } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';

config();

async function checkUser() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],
  });

  try {
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({ 
      where: { email: 'olgared@soscandia.org' } 
    });
    
    console.log('User data:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.close();
  }
}

checkUser();