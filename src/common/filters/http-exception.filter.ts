import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : 'Internal server error';

    const isProduction = process.env.NODE_ENV === 'production';
    const isServerError = status >= 500;

    const message = isServerError
      ? 'Internal server error'
      : typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message ?? 'Unexpected error';

    response.status(status).json({
      error: {
        code: isHttpException ? 'HTTP_EXCEPTION' : 'INTERNAL_ERROR',
        message,
        details:
          !isProduction && typeof exceptionResponse === 'object' && !isServerError
            ? exceptionResponse
            : undefined,
        requestId: request.requestId,
      },
    });
  }
}
