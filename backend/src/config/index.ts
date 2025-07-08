import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  mongodbTestUri: string;
  jwtSecret: string;
  jwtExpire: string;
  frontendUrl: string;
  bcryptSaltRounds: number;
  sessionSecret: string;
  apiVersion: string;
  apiPrefix: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  uploadPath: string;
  maxFileSize: number;
  email: {
    service: string;
    username: string;
    password: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dailylearn',
  mongodbTestUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/dailylearn_test',
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
  apiVersion: process.env.API_VERSION || 'v1',
  apiPrefix: process.env.API_PREFIX || '/api',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  uploadPath: process.env.UPLOAD_PATH || 'uploads/',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5000000', 10),
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    username: process.env.EMAIL_USERNAME || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI',
    'SESSION_SECRET',
    'EMAIL_USERNAME',
    'EMAIL_PASSWORD',
    'STRIPE_SECRET_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    process.exit(1);
  }
}

export default config; 