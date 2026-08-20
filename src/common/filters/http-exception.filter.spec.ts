import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { HttpExceptionFilter } from './http-exception.filter';

function createHost() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const response = { status };
  const request = { requestId: 'req-123' };

  return {
    host: {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as ArgumentsHost,
    json,
    status,
  };
}

describe('HttpExceptionFilter', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns a consistent envelope for validation/client errors', () => {
    process.env = { ...originalEnv, NODE_ENV: 'development' };
    const filter = new HttpExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new BadRequestException(['name should not exist']), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        code: 'HTTP_EXCEPTION',
        message: ['name should not exist'],
        requestId: 'req-123',
      }),
    });
  });

  it('maps Prisma unique conflicts without leaking database internals', () => {
    process.env = { ...originalEnv, NODE_ENV: 'production' };
    const filter = new HttpExceptionFilter();
    const { host, status, json } = createHost();
    const error = new Prisma.PrismaClientKnownRequestError('Unique failed on email', {
      code: 'P2002',
      clientVersion: '5.7.0',
      meta: { target: ['email'] },
    });

    filter.catch(error, host);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'RESOURCE_CONFLICT',
        message: 'Resource already exists',
        details: undefined,
        requestId: 'req-123',
      },
    });
  });
});
