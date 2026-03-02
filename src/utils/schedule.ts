/**
 * src/utils/schedule.ts
 *
 * Canonical Zod schema and TypeScript types for the doctor schedule JSON
 * stored in `doctor_profiles.schedule` (TEXT column).
 *
 * Shape (array of day-slots):
 * [
 *   {
 *     "date":      "2026-03-10",        // ISO date string YYYY-MM-DD
 *     "startTime": "08:00",             // HH:MM (24-hour)
 *     "endTime":   "12:00",             // HH:MM (24-hour), must be > startTime
 *     "available": true
 *   },
 *   ...
 * ]
 *
 * Example valid payload sent by the FE:
 * {
 *   "schedule": [
 *     { "date": "2026-03-10", "startTime": "08:00", "endTime": "12:00", "available": true },
 *     { "date": "2026-03-10", "startTime": "14:00", "endTime": "17:00", "available": true },
 *     { "date": "2026-03-11", "startTime": "09:00", "endTime": "11:30", "available": false }
 *   ]
 * }
 */

import { z } from 'zod';

/** Regex for HH:MM (00:00 – 23:59) */
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const scheduleSlotSchema = z.object({
  /** ISO date string in the format YYYY-MM-DD */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
    .refine((v) => !isNaN(Date.parse(v)), { message: 'date must be a valid calendar date' }),

  /** Start time HH:MM (24-hour) */
  startTime: z.string().regex(TIME_RE, 'startTime must be in HH:MM (24-hour) format'),

  /** End time HH:MM (24-hour) — must be strictly after startTime */
  endTime: z.string().regex(TIME_RE, 'endTime must be in HH:MM (24-hour) format'),

  /** Whether this slot is still available for booking */
  available: z.boolean(),
}).refine(
  (slot) => slot.endTime > slot.startTime,
  { message: 'endTime must be later than startTime', path: ['endTime'] }
);

/** Full schedule: an array of day-slots (max 365 entries as a safety ceiling) */
export const scheduleArraySchema = z
  .array(scheduleSlotSchema)
  .max(365, 'schedule may not contain more than 365 slots');

/** TypeScript type inferred from the schema */
export type ScheduleSlot = z.infer<typeof scheduleSlotSchema>;
export type ScheduleArray = z.infer<typeof scheduleArraySchema>;
