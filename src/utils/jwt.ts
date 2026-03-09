import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { uuidv7 } from 'uuidv7';

export interface TokenPayload {
  id: string;
  // email excluded: PII must not be stored in JWT payloads.
  role: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE,
  } as SignOptions);
};

// jti (UUIDv7) makes every refresh token's SHA-256 hash unique, preventing unique-constraint violations on refreshTokenHash.
export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE,
    jwtid: uuidv7(),
  } as SignOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
