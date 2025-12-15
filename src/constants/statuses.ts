/**
 * Centralized status constants for the application
 */

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const QUESTION_STATUS = {
  PENDING: 'PENDING',
  ANSWERED: 'ANSWERED',
  MODERATED: 'MODERATED',
} as const;

export const RATING_STATUS = {
  VISIBLE: 'VISIBLE',
  HIDDEN: 'HIDDEN',
} as const;

export const ROLE = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
} as const;

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

/**
 * Valid appointment status transitions
 * From status -> allowed target statuses
 */
export const APPOINTMENT_TRANSITIONS: Record<string, string[]> = {
  [APPOINTMENT_STATUS.PENDING]: [
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.CANCELLED,
  ],
  [APPOINTMENT_STATUS.CONFIRMED]: [
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
  ],
  [APPOINTMENT_STATUS.CANCELLED]: [], // Terminal state
  [APPOINTMENT_STATUS.COMPLETED]: [], // Terminal state
};

/**
 * Check if an appointment status transition is valid
 */
export function isValidAppointmentTransition(
  from: string,
  to: string
): boolean {
  const allowedTransitions = APPOINTMENT_TRANSITIONS[from];
  return allowedTransitions ? allowedTransitions.includes(to) : false;
}

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];
export type QuestionStatus = typeof QUESTION_STATUS[keyof typeof QUESTION_STATUS];
export type RatingStatus = typeof RATING_STATUS[keyof typeof RATING_STATUS];
export type RoleType = typeof ROLE[keyof typeof ROLE];
export type GenderType = typeof GENDER[keyof typeof GENDER];
