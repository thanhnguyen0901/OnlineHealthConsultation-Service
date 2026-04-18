import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { validateEnv } from './common/config/validate-env';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const env = validateEnv(process.env);
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: env.CORS_ORIGIN
      ? env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use((req: Request & { requestId?: string }, res: Response, next: NextFunction) => {
    const startedAt = Date.now();
    const requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      logger.log(
        `[${requestId}] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - startedAt}ms)`,
      );
    });

    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Online Health Consultation API')
    .setDescription('The MVP backend for health consultation platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = env.PORT;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Swagger docs at: http://localhost:${port}/api/docs`);
}
bootstrap();
