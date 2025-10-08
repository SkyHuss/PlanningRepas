import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  host: process.env.DB_HOST || 'localhost',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  portDB: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  username: process.env.DB_USER || 'postgres',
};
