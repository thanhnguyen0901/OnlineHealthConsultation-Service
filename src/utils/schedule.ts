import { z } from 'zod';
import type { Prisma } from '@prisma/client';

const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const scheduleSlotSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format')
    .refine((v) => !isNaN(Date.parse(v)), { message: 'date must be a valid calendar date' }),
  startTime: z.string().regex(TIME_RE, 'startTime must be in HH:MM (24-hour) format'),
  endTime: z.string().regex(TIME_RE, 'endTime must be in HH:MM (24-hour) format'),
  available: z.boolean(),
}).refine(
  (slot) => slot.endTime > slot.startTime,
  { message: 'endTime must be later than startTime', path: ['endTime'] }
);

// 365-entry safety ceiling
export const scheduleArraySchema = z
  .array(scheduleSlotSchema)
  .max(365, 'schedule may not contain more than 365 slots');

export type ScheduleSlot = z.infer<typeof scheduleSlotSchema>;
export type ScheduleArray = z.infer<typeof scheduleArraySchema>;

// Type assertion is safe: every write is validated through scheduleArraySchema; null → empty array for uninitialised schedules.
export function asScheduleArray(json: Prisma.JsonValue | null): ScheduleArray {
  if (json === null || json === undefined) return [];
  return json as unknown as ScheduleArray;
}
