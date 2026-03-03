import { Prisma } from '@prisma/client';
import prisma from '../config/db';

/**
 * Recalculate and persist ratingAverage + ratingCount for a given DoctorProfile.
 *
 * Only VISIBLE ratings are counted (hidden/moderated ratings are excluded).
 * Must be called inside a Prisma interactive transaction so the rating write and
 * the stat update are atomic.
 *
 * Concurrency strategy (RISK-01 fix):
 *   A `SELECT … FOR UPDATE` is issued on the `doctor_profiles` row first.
 *   This row-level exclusive lock serialises all concurrent transactions that
 *   touch the same doctor's aggregates, preventing the "last-writer wins" race
 *   where two simultaneous ratings could both aggregate before seeing each
 *   other's insert and the loser overwrites the winner's correct ratingCount.
 *
 * @param doctorProfileId - The DoctorProfile.id (NOT User.id)
 * @param tx              - Transaction client (or bare prisma for non-tx callers)
 */
export async function recalcDoctorRating(
  doctorProfileId: string,
  tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<void> {
  // Acquire an exclusive row-lock on the DoctorProfile row.
  // Any concurrent transaction trying to recalc ratings for the same doctor
  // will block here until this transaction commits or rolls back, ensuring
  // the aggregate query always sees a fully-settled set of Rating rows.
  await tx.$queryRaw`SELECT id FROM doctor_profiles WHERE id = ${doctorProfileId} FOR UPDATE`;

  const result = await tx.rating.aggregate({
    where: {
      doctorId: doctorProfileId,
      status: 'VISIBLE',
    },
    _avg: { score: true },
    _count: { score: true },
  });

  await tx.doctorProfile.update({
    where: { id: doctorProfileId },
    data: {
      ratingAverage: result._avg.score ?? 0,
      ratingCount: result._count.score,
    },
  });
}
