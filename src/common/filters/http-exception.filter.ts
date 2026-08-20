import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { requestId?: string }>();

    const prismaError = this.mapPrismaError(exception);
    const isHttpException = exception instanceof HttpException;
    const status = prismaError?.status ?? (isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR);

    const exceptionResponse = prismaError?.message ?? (isHttpException
      ? exception.getResponse()
      : 'Internal server error');

    const isProduction = process.env.NODE_ENV === 'production';
    const isServerError = status >= 500;

    const message = isServerError
      ? 'Internal server error'
      : typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message ?? 'Unexpected error';

    response.status(status).json({
      error: {
        code: prismaError?.code ?? this.errorCode(exceptionResponse, isHttpException),
        message,
        details:
          !isProduction && typeof exceptionResponse === 'object' && !isServerError
            ? exceptionResponse
            : undefined,
        requestId: request.requestId,
      },
    });
  }

  private errorCode(exceptionResponse: unknown, isHttpException: boolean) {
    if (!isHttpException) {
      return 'INTERNAL_ERROR';
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const code = (exceptionResponse as { code?: unknown }).code;
      if (typeof code === 'string') {
        return code;
      }
    }

    return 'HTTP_EXCEPTION';
  }

  private mapPrismaError(exception: unknown): { status: number; code: string; message: string } | null {
    if (!(exception instanceof Prisma.PrismaClientKnownRequestError)) {
      return null;
    }

    if (exception.code === 'P2002') {
      return {
        status: HttpStatus.CONFLICT,
        code: 'RESOURCE_CONFLICT',
        message: 'Resource already exists',
      };
    }

    if (exception.code === 'P2025') {
      return {
        status: HttpStatus.NOT_FOUND,
        code: 'RESOURCE_NOT_FOUND',
        message: 'Resource not found',
      };
    }

    if (exception.code === 'P2003') {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'INVALID_REFERENCE',
        message: 'Invalid related resource',
      };
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      code: 'DATABASE_REQUEST_ERROR',
      message: 'Invalid database request',
    };
  }
}
