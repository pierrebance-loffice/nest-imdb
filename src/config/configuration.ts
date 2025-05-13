import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY,
  apiBaseUrl: process.env.API_BASE_URL,
  apiVersion: process.env.API_VERSION,
  apiLanguage: process.env.API_LANGUAGE || 'en-US',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  cacheTtl: parseInt(process.env.CACHE_TTL || '3600', 10), // 1 hour in seconds
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
}));
