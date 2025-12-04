import { Response } from 'express';

export interface ApiSuccessResponse<T = any> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

/**
 * Send a success response
 */
export const sendSuccess = <T = any>(
  res: Response,
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  statusCode: number = 200
): Response => {
  const response: ApiSuccessResponse<T> = { data };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response => {
  const response: ApiErrorResponse = {
    error: {
      message,
      ...(code && { code }),
      ...(details && { details }),
    },
  };
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
export const sendPaginated = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200
): Response => {
  return sendSuccess(
    res,
    data,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    statusCode
  );
};
