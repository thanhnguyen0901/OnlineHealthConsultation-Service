/**
 * Centralized error codes for consistent error handling
 */

export const ERROR_CODES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  REFRESH_TOKEN_MISSING: 'REFRESH_TOKEN_MISSING',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  FORBIDDEN: 'FORBIDDEN',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  // Sent when a client submits a body field that must NOT be in the body
  // (e.g. refreshToken must only travel via httpOnly cookie, never in the body)
  BODY_NOT_ALLOWED: 'BODY_NOT_ALLOWED',
  // Refresh token was already rotated and the reuse arrived within the grace window.
  // Indicates a concurrent (race) request — not a replay attack.
  // HTTP 409: client should retry; the new cookie was already set by the winning request.
  TOKEN_ROTATED: 'TOKEN_ROTATED',
  // Refresh token reuse detected outside the grace window — potential theft / replay attack.
  // HTTP 401: all sessions revoked; user must log in again.
  TOKEN_REUSE_DETECTED: 'TOKEN_REUSE_DETECTED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_SCORE: 'INVALID_SCORE',
  
  // Resource Not Found
  NOT_FOUND: 'NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  DOCTOR_NOT_FOUND: 'DOCTOR_NOT_FOUND',
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  APPOINTMENT_NOT_FOUND: 'APPOINTMENT_NOT_FOUND',
  RATING_NOT_FOUND: 'RATING_NOT_FOUND',
  SPECIALTY_NOT_FOUND: 'SPECIALTY_NOT_FOUND',
  
  // Conflict
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  APPOINTMENT_CONFLICT: 'APPOINTMENT_CONFLICT',
  RATING_EXISTS: 'RATING_EXISTS',
  
  // Business Logic
  APPOINTMENT_NOT_COMPLETED: 'APPOINTMENT_NOT_COMPLETED',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  INVALID_SCHEDULED_AT: 'INVALID_SCHEDULED_AT',
  DOCTOR_NOT_ASSIGNED: 'DOCTOR_NOT_ASSIGNED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  
  // Rate Limiting
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
