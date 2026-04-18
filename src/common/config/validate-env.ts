import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRE: z.string().min(2).default('15m'),
  JWT_REFRESH_EXPIRE: z.string().min(2).default('7d'),
  CORS_ORIGIN: z.string().optional(),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),
  CONSULTATION_EARLY_JOIN_MINUTES: z.coerce.number().int().min(0).max(120).default(15),
  CONSULTATION_LATE_JOIN_MINUTES: z.coerce.number().int().min(0).max(240).default(30),
  VIDEO_PROVIDER_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),
  NOTIFICATION_OUTBOX_CRON: z.string().optional(),
  NOTIFICATION_REMINDER_CRON: z.string().optional(),
  NOTIFICATION_OUTBOX_BATCH_LIMIT: z.coerce.number().int().min(1).max(500).default(100),
  NOTIFICATION_REMINDER_WINDOW_MINUTES: z.coerce.number().int().min(1).max(1440).default(60),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(env: NodeJS.ProcessEnv): AppEnv {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Environment validation failed: ${errors}`);
  }

  return result.data;
}
