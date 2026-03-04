import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { sendError } from './utils/apiResponse';
import { apiRateLimiter } from './middlewares/rateLimiter.middleware';

// Crash early: insecure cookies in production expose session tokens over plain HTTP.
if (env.NODE_ENV === 'production' && !env.COOKIE_SECURE) {
  console.error(
    '[FATAL] COOKIE_SECURE must be true in production. ' +
    'Set COOKIE_SECURE=true in your environment and ensure the app is served over HTTPS.'
  );
  process.exit(1);
}

const app: Application = express();

// trust proxy 1: req.ip reflects the real client IP from X-Forwarded-For; must precede rate-limiter middleware.
app.set('trust proxy', 1);

// CSP fully enforced in production; report-only in development (violations logged, no request blocking).
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production'
    ? true               // enforced with helmet defaults
    : { reportOnly: true }, // report-only: same directives, no blocking
  crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
}));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // Required for cross-origin httpOnly cookie auth.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // Auth routes excluded from body logging to avoid logging passwords.
  app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    if (
      req.method !== 'GET' &&
      !req.path.includes('/auth/login') &&
      !req.path.includes('/auth/register') &&
      !req.path.includes('/auth/refresh') &&
      Object.keys(req.body ?? {}).length > 0
    ) {
      console.log(`[REQ BODY] ${req.method} ${req.path}`, JSON.stringify(req.body));
    }
    next();
  });
} else {
  app.use(morgan('combined'));
}

app.use('/api', apiRateLimiter);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Online Health Consultation API',
    version: '1.0.0',
    status: 'running',
  });
});

app.use('/api', routes);

app.use((_req: Request, res: Response) => {
  sendError(res, 'Route not found', 404, 'NOT_FOUND');
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
