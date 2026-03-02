import { Prisma } from '@prisma/client';
import prisma from '../config/db';

/**
 * Recalculate and persist ratingAverage + ratingCount for a given DoctorProfile.
 *
 * Only VISIBLE ratings are counted (hidden/moderated ratings are excluded).
 * Must be called inside a Prisma interactive transaction so the rating write and
 * the stat update are atomic.
 *
 * @param doctorProfileId - The DoctorProfile.id (NOT User.id)
 * @param tx              - Transaction client (or bare prisma for non-tx callers)
 */
export async function recalcDoctorRating(
  doctorProfileId: string,
  tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<void> {
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
