import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { uuidv7 } from 'uuidv7';

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
 * A unique `jti` (UUIDv7) is embedded so that every issued token produces a
 * distinct SHA-256 hash even when two tokens are signed within the same second
 * with identical payload fields — preventing the unique constraint violation on
 * `user_sessions_refreshTokenHash_key`.
 * The `jti` is not stored or verified separately; its sole purpose is entropy.
 */
export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
    jwtid: uuidv7(),
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
