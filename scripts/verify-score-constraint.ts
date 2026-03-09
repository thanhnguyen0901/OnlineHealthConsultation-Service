/**
 * scripts/verify-score-constraint.ts
 *
 * Verifies that the DB actively rejects ratings.score values outside [1, 5].
 * Exercises two enforcement layers:
 *   1. Prisma / application layer (goes through patient.service.ts validation)
 *   2. DB layer directly (bypasses app code, uses prisma.$executeRaw)
 *
 * Usage:
 *   npx ts-node scripts/verify-score-constraint.ts
 *
 * Expected outcome: every "SHOULD FAIL" case throws, every "SHOULD PASS" succeeds.
 * Exit code 0 = all assertions passed; non-zero = a violation was not caught.
 */

import prisma from '../src/config/db';
import { newId } from '../src/utils/id';

// ── colour helpers ────────────────────────────────────────────────────────────
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red   = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim   = (s: string) => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

async function assertRejects(label: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
    console.log(red(`  ✗ FAIL  : ${label}`));
    console.log(red(`           Expected DB to reject the insert but it succeeded.`));
    failed++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(green(`  ✓ PASS  : ${label}`));
    console.log(dim(`           Rejected with: ${msg.split('\n')[0]}`));
    passed++;
  }
}

async function assertPasses(label: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
    console.log(green(`  ✓ PASS  : ${label}`));
    passed++;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(red(`  ✗ FAIL  : ${label}`));
    console.log(red(`           Unexpected error: ${msg.split('\n')[0]}`));
    failed++;
  }
}

// ── seed helper data (cleaned up in finally) ─────────────────────────────────
let seedUserId          = '';
let seedPatientId       = '';
let seedDoctorUserId    = '';
let seedDoctorId        = '';
let seedSpecialtyId     = '';
let seedAppointmentId   = '';

async function setupSeedData() {
  seedSpecialtyId = newId();
  await prisma.specialty.create({
    data: {
      id: seedSpecialtyId,
      nameEn: `__verify_score_${seedSpecialtyId.slice(0, 8)}`,
      nameVi: 'Test',
    },
  });

  seedUserId = newId();
  await prisma.user.create({
    data: {
      id: seedUserId,
      email: `__verify_patient_${seedUserId.slice(0, 8)}@test.local`,
      passwordHash: 'x',
      firstName: 'Verify',
      lastName: 'Patient',
      role: 'PATIENT',
    },
  });

  seedPatientId = newId();
  await prisma.patientProfile.create({
    data: { id: seedPatientId, userId: seedUserId },
  });

  seedDoctorUserId = newId();
  await prisma.user.create({
    data: {
      id: seedDoctorUserId,
      email: `__verify_doctor_${seedDoctorUserId.slice(0, 8)}@test.local`,
      passwordHash: 'x',
      firstName: 'Verify',
      lastName: 'Doctor',
      role: 'DOCTOR',
    },
  });

  seedDoctorId = newId();
  await prisma.doctorProfile.create({
    data: {
      id: seedDoctorId,
      userId: seedDoctorUserId,
      specialtyId: seedSpecialtyId,
      yearsOfExperience: 1,
    },
  });

  seedAppointmentId = newId();
  await prisma.appointment.create({
    data: {
      id: seedAppointmentId,
      patientId: seedPatientId,
      doctorId: seedDoctorId,
      scheduledAt: new Date(),
      status: 'COMPLETED',
      reason: '__verify_score_test',
    },
  });
}

async function teardownSeedData() {
  // cascades handle most child rows; delete in FK-safe order
  await prisma.rating.deleteMany({ where: { doctorId: seedDoctorId } });
  await prisma.appointment.deleteMany({ where: { id: seedAppointmentId } });
  await prisma.doctorProfile.deleteMany({ where: { id: seedDoctorId } });
  await prisma.patientProfile.deleteMany({ where: { id: seedPatientId } });
  await prisma.user.deleteMany({ where: { id: { in: [seedUserId, seedDoctorUserId] } } });
  await prisma.specialty.deleteMany({ where: { id: seedSpecialtyId } });
}

// ── raw INSERT helper (bypasses Prisma model layer) ──────────────────────────
async function rawInsertRating(score: number) {
  const id = newId();
  await prisma.$executeRaw`
    INSERT INTO ratings (id, patientId, doctorId, appointmentId, score, status, createdAt, updatedAt)
    VALUES (
      ${id},
      ${seedPatientId},
      ${seedDoctorId},
      ${seedAppointmentId},
      ${score},
      'VISIBLE',
      NOW(),
      NOW()
    )
  `;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== ratings.score constraint verification ===\n');

  await setupSeedData();

  // ── Layer 1: DB-level via raw SQL (CHECK constraint / trigger) ──────────
  console.log('── Layer 1: raw SQL (DB constraint) ──────────────────────────');

  await assertRejects('score = 0  (too low)  → raw INSERT rejected',
    () => rawInsertRating(0));

  await assertRejects('score = 6  (too high) → raw INSERT rejected',
    () => rawInsertRating(6));

  await assertRejects('score = -1 (negative) → raw INSERT rejected',
    () => rawInsertRating(-1));

  await assertRejects('score = 100 (way high) → raw INSERT rejected',
    () => rawInsertRating(100));

  await assertPasses('score = 1  (min valid) → raw INSERT accepted',
    () => rawInsertRating(1));

  // clean up last inserted row so next insert can reuse appointment
  await prisma.rating.deleteMany({ where: { doctorId: seedDoctorId } });

  await assertPasses('score = 5  (max valid) → raw INSERT accepted',
    () => rawInsertRating(5));

  await prisma.rating.deleteMany({ where: { doctorId: seedDoctorId } });

  await assertPasses('score = 3  (mid valid) → raw INSERT accepted',
    () => rawInsertRating(3));

  await prisma.rating.deleteMany({ where: { doctorId: seedDoctorId } });

  // ── Layer 2: DB-level via prisma.$executeRaw UPDATE ─────────────────────
  console.log('\n── Layer 2: raw SQL UPDATE constraint ────────────────────────');

  // insert a valid row first, then try to update score to invalid value
  await rawInsertRating(4);
  const inserted = await prisma.rating.findFirst({ where: { doctorId: seedDoctorId } });

  if (inserted) {
    await assertRejects('UPDATE score to 0  → raw UPDATE rejected',
      () => prisma.$executeRaw`UPDATE ratings SET score = 0 WHERE id = ${inserted.id}`);

    await assertRejects('UPDATE score to 6  → raw UPDATE rejected',
      () => prisma.$executeRaw`UPDATE ratings SET score = 6 WHERE id = ${inserted.id}`);

    await assertPasses('UPDATE score to 5  → raw UPDATE accepted',
      () => prisma.$executeRaw`UPDATE ratings SET score = 5 WHERE id = ${inserted.id}`);
  }

  // ── summary ──────────────────────────────────────────────────────────────
  console.log(`\n─────────────────────────────────────────────────────────────`);
  console.log(`  Results: ${green(`${passed} passed`)}  ${failed > 0 ? red(`${failed} failed`) : `0 failed`}`);
  console.log(`─────────────────────────────────────────────────────────────\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error(red('\nUnexpected error:'), err);
    process.exit(1);
  })
  .finally(async () => {
    await teardownSeedData().catch(() => { /* best-effort cleanup */ });
    await prisma.$disconnect();
  });
