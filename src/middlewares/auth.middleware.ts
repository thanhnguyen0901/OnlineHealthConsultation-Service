import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { ERROR_CODES } from '../constants/errorCodes';
import prisma from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401, ERROR_CODES.UNAUTHORIZED);
      return;
    }

    const token = authHeader.substring(7);

    try {
      const payload = verifyAccessToken(token);

      // Re-check isActive and deletedAt in DB so deactivations take effect
      // immediately without waiting for the access token's 15-min TTL.
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { isActive: true, deletedAt: true },
      });

      if (!dbUser || !dbUser.isActive || dbUser.deletedAt !== null) {
        sendError(res, 'Account is deactivated', 403, ERROR_CODES.ACCOUNT_DEACTIVATED);
        return;
      }

      req.user = payload;
      next();
    } catch (error) {
      sendError(res, 'Invalid or expired token', 401, ERROR_CODES.UNAUTHORIZED);
      return;
    }
  } catch (error) {
    sendError(res, 'Authentication failed', 401, ERROR_CODES.UNAUTHORIZED);
    return;
  }
};
