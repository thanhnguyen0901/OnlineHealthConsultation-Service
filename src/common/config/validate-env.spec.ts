import { validateEnv } from './validate-env';

const baseEnv = {
  NODE_ENV: 'production',
  PORT: '3000',
  DATABASE_URL: 'postgresql://user:password@localhost:5432/ohc',
  JWT_SECRET: 'production-access-secret-at-least-32',
  JWT_REFRESH_SECRET: 'production-refresh-secret-at-least-32',
  JWT_ACCESS_EXPIRE: '15m',
  JWT_REFRESH_EXPIRE: '7d',
  CORS_ORIGIN: 'https://app.example.com',
  AUTH_REFRESH_COOKIE_SAME_SITE: 'lax',
  NOTIFICATION_PROVIDER: 'email',
};

describe('validateEnv security hardening', () => {
  it('rejects production config without explicit CORS origin', () => {
    const env = { ...baseEnv };
    delete (env as Partial<typeof baseEnv>).CORS_ORIGIN;

    expect(() => validateEnv(env as NodeJS.ProcessEnv)).toThrow(/CORS_ORIGIN/);
  });

  it('rejects known development JWT secrets in production', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        JWT_SECRET: 'super-secret-key-for-dev',
        JWT_REFRESH_SECRET: 'refresh-secret-dev',
      } as NodeJS.ProcessEnv),
    ).toThrow(/JWT_SECRET|JWT_REFRESH_SECRET/);
  });

  it('rejects SameSite=None cookies without Secure in production', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        AUTH_REFRESH_COOKIE_SAME_SITE: 'none',
        AUTH_REFRESH_COOKIE_SECURE: 'false',
      } as NodeJS.ProcessEnv),
    ).toThrow(/AUTH_REFRESH_COOKIE_SECURE/);
  });

  it('rejects the development notification provider in production', () => {
    expect(() =>
      validateEnv({
        ...baseEnv,
        NOTIFICATION_PROVIDER: 'development',
      } as NodeJS.ProcessEnv),
    ).toThrow(/NOTIFICATION_PROVIDER/);
  });
});
