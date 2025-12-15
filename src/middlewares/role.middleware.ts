import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';
import { ERROR_CODES } from '../constants/errorCodes';

/**
 * Middleware factory to check if user has required role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401, ERROR_CODES.UNAUTHORIZED);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'You do not have permission to access this resource',
        403,
        ERROR_CODES.FORBIDDEN
      );
      return;
    }

    next();
  };
};

/**
 * Shorthand middleware for patient-only routes
 */
export const requirePatient = requireRole(['PATIENT']);

/**
 * Shorthand middleware for doctor-only routes
 */
export const requireDoctor = requireRole(['DOCTOR']);

/**
 * Shorthand middleware for admin-only routes
 */
export const requireAdmin = requireRole(['ADMIN']);
