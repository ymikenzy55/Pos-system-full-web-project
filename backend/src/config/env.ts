import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment-specific .env file only in development
if (process.env.NODE_ENV !== 'production') {
  const envFile = '.env.development';
  dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRY',
  'BCRYPT_SALT_ROUNDS',
  'NODE_ENV',
  'PORT',
  'FRONTEND_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiry: process.env.JWT_EXPIRY || '24h' as string,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  },
  server: {
    nodeEnv: process.env.NODE_ENV!,
    port: parseInt(process.env.PORT || '3000', 10),
    frontendUrl: process.env.FRONTEND_URL!,
  },
  rateLimit: {
    auth: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10),
    },
    api: {
      windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '900000', 10),
      max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
  },
};
