import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRE: z.string().default('15m'),
  JWT_REFRESH_EXPIRE: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  // Raise from 10→12: each additional round doubles hashing time.
  // 12 rounds ≈ 250–400 ms on modern hardware — acceptable for auth endpoints
  // while making offline brute-force attacks ~4× more expensive than 10.
  BCRYPT_ROUNDS: z.string().default('12').transform(Number),
  COOKIE_SECURE: z.string().default('true').transform((val) => val === 'true'),
  COOKIE_SAMESITE: z.enum(['none', 'lax', 'strict']).default('lax'),
  COOKIE_DOMAIN: z.string().optional(),
  // Days after expiry/revocation before a dead session row is deleted (default 7)
  SESSION_CLEANUP_RETENTION_DAYS: z.string().default('7').transform(Number),
  // Default appointment slot duration in minutes (RISK-10 context).
  // The booking service now stores durationMinutes per-appointment (default 60)
  // rather than using this shared env var for conflict detection.
  // Retained here for the verify-appointment-conflict.ts script and any tooling
  // that needs a configurable default when creating appointments programmatically.
  APPOINTMENT_DURATION_MINUTES: z.string().default('60').transform(Number),
  // Grace window (ms) for refresh token reuse after rotation.
  // If a previously-rotated refresh token is presented again within this window
  // we assume it is a race condition (concurrent tab reload, retry storm) rather
  // than a replay attack, and return 409 TOKEN_ROTATED instead of revoking all
  // sessions. Set to 0 to disable the grace window (strict mode).
  REFRESH_GRACE_WINDOW_MS: z.string().default('10000').transform(Number),
});

// Validate and parse environment variables
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
