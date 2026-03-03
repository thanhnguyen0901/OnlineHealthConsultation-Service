import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  id: string;
  // email intentionally excluded — PII must not be stored in JWT payloads.
  // Fetch email from the DB when required (e.g. password-reset flows).
  role: string;
}

/**
 * Sign an access token
 */
export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE,
  } as SignOptions);
};

/**
 * Sign a refresh token.
 * Uniqueness is guaranteed by the SHA-256 hash of the full token string
 * (which incorporates the iat claim added by jsonwebtoken and payload entropy).
 * jti is intentionally omitted: it was generated but never stored or verified,
 * making it dead weight that only inflated token size.
 */
export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
  } as SignOptions);
};

/**
 * Verify an access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
// decodeToken (jwt.decode without verify) was intentionally removed.
// Using unverified JWT data in auth paths is a security risk.
// If introspection is needed in tests, call jwt.decode directly there.
