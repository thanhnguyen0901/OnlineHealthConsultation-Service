import { Prisma } from '@prisma/client';
import prisma from '../config/db';

// Only VISIBLE ratings are counted in the aggregates.
// SELECT FOR UPDATE serialises concurrent recalculations: two simultaneous ratings cannot both aggregate before seeing each other's insert.
export async function recalcDoctorRating(
  doctorProfileId: string,
  tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<void> {
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
