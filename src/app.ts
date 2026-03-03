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

// Production safety assertion: insecure cookies in production expose session
// tokens over plain HTTP and must never be allowed. Crash early with a clear
// message rather than silently shipping a security hole.
if (env.NODE_ENV === 'production' && !env.COOKIE_SECURE) {
  console.error(
    '[FATAL] COOKIE_SECURE must be true in production. ' +
    'Set COOKIE_SECURE=true in your environment and ensure the app is served over HTTPS.'
  );
  process.exit(1);
}

const app: Application = express();

// Trust the first hop from a reverse proxy (nginx, load balancer) so that
// req.ip reflects the real client IP from X-Forwarded-For rather than the
// proxy address. Must be set before any IP-sensitive middleware (rate limiters).
app.set('trust proxy', 1);

// Security headers
// Production: CSP is fully enforced.
// Development: CSP runs in report-only mode — violations are logged to the
// browser console / any report-uri without blocking requests, so dev workflow
// is unaffected while policy violations are caught early.
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production'
    ? true               // enforced with helmet defaults
    : { reportOnly: true }, // report-only: same directives, no blocking
  crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
}));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow multiple origins (comma-separated in env)
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // CRITICAL: Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// Cookie parser for refresh token support
app.use(cookieParser());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // Log request body in development so 400 validation failures are easy to debug.
  // Auth routes are excluded to avoid logging passwords.
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

// Global rate limiting
app.use('/api', apiRateLimiter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Online Health Consultation API',
    version: '1.0.0',
    status: 'running',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  sendError(res, 'Route not found', 404, 'NOT_FOUND');
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
