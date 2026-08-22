import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-key-finance-advisor-2026',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID || '',
  PLAID_SECRET: process.env.PLAID_SECRET || '',
  PLAID_ENV: process.env.PLAID_ENV || 'sandbox',
  EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY || 'mock_key',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
