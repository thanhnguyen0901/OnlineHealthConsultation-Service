import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  // 12 rounds balances brute-force resistance against ~300 ms hash latency on modern hardware.
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  COOKIE_SECURE: z.string().default('true').transform((val) => val === 'true'),
  COOKIE_SAMESITE: z.enum(['none', 'lax', 'strict']).default('lax'),
  COOKIE_DOMAIN: z.string().optional(),
  SESSION_CLEANUP_RETENTION_DAYS: z.string().default('30').transform(Number),
  // Caps DELETE batch size per cron iteration to prevent long table locks on large tables.
  SESSION_CLEANUP_BATCH_SIZE: z.string().default('500').transform(Number),
  APPOINTMENT_DURATION_MINUTES: z.string().default('60').transform(Number),
  // Reuse within window → 409 TOKEN_ROTATED (race, not replay); outside window → 401 all sessions revoked. Set 0 for strict mode.
  REFRESH_GRACE_WINDOW_MS: z.string().default('10000').transform(Number),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

export default env;
