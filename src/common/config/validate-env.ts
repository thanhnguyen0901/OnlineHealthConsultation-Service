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
  APP_TIMEZONE: z.string().min(1).default('Asia/Ho_Chi_Minh'),
  APPOINTMENT_DURATION_MINUTES: z.coerce.number().int().min(15).max(240).default(60),
  APPOINTMENT_SLOT_STEP_MINUTES: z.coerce.number().int().min(5).max(120).default(30),
  AUTH_REFRESH_COOKIE_NAME: z.string().min(1).default('ohc_refresh_token'),
  AUTH_REFRESH_COOKIE_PATH: z.string().min(1).default('/api/auth'),
  AUTH_REFRESH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  AUTH_REFRESH_COOKIE_SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(10),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: z.coerce.number().int().min(5).max(120).default(15),
  PASSWORD_RESET_FRONTEND_URL: z.string().url().default('http://localhost:5173/reset-password'),
  PASSWORD_RESET_NOTIFICATION_PROVIDER: z.string().min(1).optional(),
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
  NOTIFICATION_PROVIDER: z.enum(['development', 'email']).default('development'),
  NOTIFICATION_EMAIL_PROVIDER: z.string().min(1).optional(),
  NOTIFICATION_EMAIL_PROVIDER_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),
  NOTIFICATION_SMS_PROVIDER: z.string().min(1).optional(),
  NOTIFICATION_SMS_PROVIDER_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),
}).superRefine((env, ctx) => {
  if (env.NODE_ENV !== 'production') {
    return;
  }

  const forbiddenJwtSecrets = new Set([
    'super-secret-key-for-dev',
    'refresh-secret-dev',
    'change-me',
    'changeme',
  ]);

  if (env.JWT_SECRET.length < 32 || forbiddenJwtSecrets.has(env.JWT_SECRET)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['JWT_SECRET'],
      message: 'JWT_SECRET must be a strong production secret',
    });
  }

  if (env.JWT_REFRESH_SECRET.length < 32 || forbiddenJwtSecrets.has(env.JWT_REFRESH_SECRET)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['JWT_REFRESH_SECRET'],
      message: 'JWT_REFRESH_SECRET must be a strong production secret',
    });
  }

  if (!env.CORS_ORIGIN) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['CORS_ORIGIN'],
      message: 'CORS_ORIGIN is required in production',
    });
  }

  if (env.AUTH_REFRESH_COOKIE_SAME_SITE === 'none' && env.AUTH_REFRESH_COOKIE_SECURE !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['AUTH_REFRESH_COOKIE_SECURE'],
      message: 'AUTH_REFRESH_COOKIE_SECURE must be true when SameSite=None',
    });
  }

  if (env.AUTH_REFRESH_COOKIE_SECURE === false) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['AUTH_REFRESH_COOKIE_SECURE'],
      message: 'AUTH_REFRESH_COOKIE_SECURE must not be false in production',
    });
  }

  if (env.PASSWORD_RESET_FRONTEND_URL.includes('localhost')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['PASSWORD_RESET_FRONTEND_URL'],
      message: 'PASSWORD_RESET_FRONTEND_URL must point to the deployed frontend in production',
    });
  }

  if (env.NOTIFICATION_PROVIDER === 'development') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['NOTIFICATION_PROVIDER'],
      message: 'NOTIFICATION_PROVIDER must not be development in production',
    });
  }
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
