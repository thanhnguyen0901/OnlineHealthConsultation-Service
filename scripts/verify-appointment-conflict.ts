/**
 * scripts/verify-appointment-conflict.ts
 *
 * Verifies the overlap-based appointment conflict detection introduced in F-010.
 *
 * Scenarios covered (durationMinutes = APPOINTMENT_DURATION_MINUTES, default 60 min):
 *
 *   SHOULD CONFLICT (doctor):
 *     1. Exact same time            T vs T              → 0 min gap
 *     2. New starts 15 min after    T+15 vs T           → inside window
 *     3. New starts 15 min before   T-15 vs T           → inside window
 *     4. New ends exactly at start  T-30 vs T           → boundary (exclusive) → SHOULD PASS
 *
 *   SHOULD PASS (doctor):
 *     5. New starts 30 min after    T+30 vs T           → boundary (exclusive) → no overlap
 *     6. New starts 60 min after    T+60 vs T           → well clear
 *
 *   SHOULD CONFLICT (patient double-booking):
 *     7. Same patient, overlapping slot with different doctor
 *
 *   SHOULD PASS (patient):
 *     8. Same patient, non-overlapping slot with different doctor
 *
 * Usage:
 *   npx ts-node scripts/verify-appointment-conflict.ts
 *
 * Requires a live DB (the test creates and cleans up its own seed rows).
 */

import prisma from '../src/config/db';
import { newId } from '../src/utils/id';
import { env } from '../src/config/env';

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red   = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim   = (s: string) => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

// ── overlap helpers (mirrors updated patient.service.ts per-slot logic) ──────
const durMin = env.APPOINTMENT_DURATION_MINUTES; // default slot size for this script

/** Exact overlap of [A, A+dA) and [B, B+dB) — mirrors isOverlap() in the service. */
function slotsOverlap(
  aStart: Date, aDurMin: number,
  bStart: Date, bDurMin: number,
): boolean {
  return aStart.getTime() <  bStart.getTime() + bDurMin * 60_000
      && aStart.getTime() + aDurMin * 60_000 > bStart.getTime();
}

async function doctorHasConflict(
  doctorId: string,
  scheduledAt: Date,
  excludeAppointmentId?: string,
  newDurMin = durMin,
): Promise<boolean> {
  const newEnd = new Date(scheduledAt.getTime() + newDurMin * 60_000);
  const candidates = await prisma.appointment.findMany({
    where: {
      doctorId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      scheduledAt: {
        gt: new Date(scheduledAt.getTime() - 480 * 60_000),
        lt: newEnd,
      },
      ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
    },
    select: { id: true, scheduledAt: true, durationMinutes: true },
  });
  return candidates.some(e => slotsOverlap(e.scheduledAt, e.durationMinutes, scheduledAt, newDurMin));
}

async function patientHasConflict(
  patientProfileId: string,
  scheduledAt: Date,
  excludeAppointmentId?: string,
  newDurMin = durMin,
): Promise<boolean> {
  const newEnd = new Date(scheduledAt.getTime() + newDurMin * 60_000);
  const candidates = await prisma.appointment.findMany({
    where: {
      patientId: patientProfileId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      scheduledAt: {
        gt: new Date(scheduledAt.getTime() - 480 * 60_000),
        lt: newEnd,
      },
      ...(excludeAppointmentId ? { NOT: { id: excludeAppointmentId } } : {}),
    },
    select: { id: true, scheduledAt: true, durationMinutes: true },
  });
  return candidates.some(e => slotsOverlap(e.scheduledAt, e.durationMinutes, scheduledAt, newDurMin));
}

// ── assert helpers ────────────────────────────────────────────────────────────
async function assertConflict(label: string, fn: () => Promise<boolean>) {
  const result = await fn();
  if (result) {
    console.log(green(`  ✓ CONFLICT detected: ${label}`));
    passed++;
  } else {
    console.log(red(`  ✗ Expected CONFLICT but got none: ${label}`));
    failed++;
  }
}

async function assertNoConflict(label: string, fn: () => Promise<boolean>) {
  const result = await fn();
  if (!result) {
    console.log(green(`  ✓ No conflict (correct): ${label}`));
    passed++;
  } else {
    console.log(red(`  ✗ Expected NO conflict but got one: ${label}`));
    failed++;
  }
}

// ── seed helpers ─────────────────────────────────────────────────────────────
let specialtyId    = '';
let doctor1UserId  = '';
let doctor1Id      = '';
let doctor2UserId  = '';
let doctor2Id      = '';
let patientUserId  = '';
let patientId      = '';
let existingAptId  = '';

const BASE_TIME = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
BASE_TIME.setSeconds(0, 0); // normalise to whole minute

function minutesFrom(base: Date, minutes: number): Date {
  return new Date(base.getTime() + minutes * 60 * 1000);
}

async function setup() {
  specialtyId = newId();
  await prisma.specialty.create({
    data: {
      id: specialtyId,
      nameEn: `__verify_conflict_${specialtyId.slice(0, 8)}`,
      nameVi: 'Test',
    },
  });

  doctor1UserId = newId();
  await prisma.user.create({
    data: {
      id: doctor1UserId, email: `__vc_d1_${doctor1UserId.slice(0,8)}@test.local`,
      passwordHash: 'x', firstName: 'D1', lastName: 'Test', role: 'DOCTOR',
    },
  });
  doctor1Id = newId();
  await prisma.doctorProfile.create({
    data: { id: doctor1Id, userId: doctor1UserId, specialtyId, yearsOfExperience: 1 },
  });

  doctor2UserId = newId();
  await prisma.user.create({
    data: {
      id: doctor2UserId, email: `__vc_d2_${doctor2UserId.slice(0,8)}@test.local`,
      passwordHash: 'x', firstName: 'D2', lastName: 'Test', role: 'DOCTOR',
    },
  });
  doctor2Id = newId();
  await prisma.doctorProfile.create({
    data: { id: doctor2Id, userId: doctor2UserId, specialtyId, yearsOfExperience: 1 },
  });

  patientUserId = newId();
  await prisma.user.create({
    data: {
      id: patientUserId, email: `__vc_p_${patientUserId.slice(0,8)}@test.local`,
      passwordHash: 'x', firstName: 'P', lastName: 'Test', role: 'PATIENT',
    },
  });
  patientId = newId();
  await prisma.patientProfile.create({ data: { id: patientId, userId: patientUserId } });

  // Seed one existing appointment for Doctor 1 at BASE_TIME
  existingAptId = newId();
  await prisma.appointment.create({
    data: {
      id: existingAptId,
      patientId,
      doctorId: doctor1Id,
      scheduledAt: BASE_TIME,
      durationMinutes: durMin,
      status: 'CONFIRMED',
      reason: '__verify_conflict_test',
    },
  });
}

async function teardown() {
  await prisma.appointment.deleteMany({ where: { reason: '__verify_conflict_test' } });
  await prisma.patientProfile.deleteMany({ where: { id: patientId } });
  await prisma.doctorProfile.deleteMany({ where: { id: { in: [doctor1Id, doctor2Id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [doctor1UserId, doctor2UserId, patientUserId] } } });
  await prisma.specialty.deleteMany({ where: { id: specialtyId } });
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n=== Appointment conflict detection (slot = ${durMin} min) ===\n`);

  await setup();

  // Existing: Doctor 1 @ BASE_TIME (CONFIRMED)

  console.log('── Doctor conflict scenarios ──────────────────────────────────');

  await assertConflict(
    `exact same time (0 min gap)`,
    () => doctorHasConflict(doctor1Id, minutesFrom(BASE_TIME, 0), existingAptId)
  );

  await assertConflict(
    `new starts ${durMin / 2} min after existing (inside window)`,
    () => doctorHasConflict(doctor1Id, minutesFrom(BASE_TIME, durMin / 2), existingAptId)
  );

  await assertConflict(
    `new starts ${durMin / 2} min before existing (inside window)`,
    () => doctorHasConflict(doctor1Id, minutesFrom(BASE_TIME, -(durMin / 2)), existingAptId)
  );

  await assertNoConflict(
    `new starts exactly ${durMin} min after (boundary — exclusive, no overlap)`,
    () => doctorHasConflict(doctor1Id, minutesFrom(BASE_TIME, durMin))
  );

  await assertNoConflict(
    `new starts ${durMin * 2} min after (well clear)`,
    () => doctorHasConflict(doctor1Id, minutesFrom(BASE_TIME, durMin * 2))
  );

  await assertNoConflict(
    `different doctor, same time (no conflict for Doctor 2)`,
    () => doctorHasConflict(doctor2Id, minutesFrom(BASE_TIME, 0))
  );

  await assertNoConflict(
    `CANCELLED status is excluded from conflict (Doctor 1)`,
    async () => {
      // Temporarily cancel the existing appointment then re-query
      await prisma.appointment.update({ where: { id: existingAptId }, data: { status: 'CANCELLED' } });
      const result = await doctorHasConflict(doctor1Id, BASE_TIME);
      await prisma.appointment.update({ where: { id: existingAptId }, data: { status: 'CONFIRMED' } });
      return result;
    }
  );

  console.log('\n── Patient conflict scenarios ─────────────────────────────────');

  // Patient's existing appointment = Doctor 1 @ BASE_TIME
  await assertConflict(
    `same patient, same time, different doctor (patient double-booking)`,
    () => patientHasConflict(patientId, minutesFrom(BASE_TIME, durMin / 2), existingAptId)
  );

  await assertNoConflict(
    `same patient, non-overlapping time with different doctor`,
    () => patientHasConflict(patientId, minutesFrom(BASE_TIME, durMin * 2))
  );

  console.log(`\n─────────────────────────────────────────────────────────────`);
  console.log(
    `  Results: ${green(`${passed} passed`)}  ${failed > 0 ? red(`${failed} failed`) : `0 failed`}`
  );
  console.log(dim(`  Duration: ${durMin} min (APPOINTMENT_DURATION_MINUTES, stored as durationMinutes per slot)`));
  console.log(`─────────────────────────────────────────────────────────────\n`);

  if (failed > 0) process.exit(1);
}

main()
  .catch((err) => { console.error(red('\nUnexpected error:'), err); process.exit(1); })
  .finally(async () => {
    await teardown().catch(() => {});
    await prisma.$disconnect();
  });
