import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { sendError } from './utils/apiResponse';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Online Health Consultation API',
    version: '1.0.0',
    status: 'running',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, 'Route not found', 404, 'NOT_FOUND');
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
