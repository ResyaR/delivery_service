import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Load .env file

const isVercel = !!process.env.VERCEL;

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  
  // Connection pool configuration untuk serverless
  extra: isVercel ? {
    max: 1, // HANYA 1 connection untuk migrations di serverless
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    statement_timeout: 20000,
    query_timeout: 20000,
    allowExitOnIdle: true,
    keepAlive: false,
  } : {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    statement_timeout: 30000,
    query_timeout: 30000,
    allowExitOnIdle: false,
    keepAlive: true,
  },
});