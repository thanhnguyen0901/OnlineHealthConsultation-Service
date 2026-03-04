// Dead = expired or revoked, past the SESSION_CLEANUP_RETENTION_DAYS grace window.
import prisma from '../config/db';
import { env } from '../config/env';

function retentionCutoff(): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - env.SESSION_CLEANUP_RETENTION_DAYS);
  return cutoff;
}

export async function cleanupUserSessions(userId: string): Promise<number> {
  const cutoff = retentionCutoff();

  const result = await prisma.userSession.deleteMany({
    where: {
      userId,
      OR: [
        { expiresAt: { lt: cutoff } },
        { revokedAt: { lt: cutoff } },
      ],
    },
  });

  if (env.NODE_ENV !== 'production' && result.count > 0) {
    console.debug(
      `[SessionCleanup] per-user` +
      ` | userId=${userId}` +
      ` | deleted=${result.count}` +
      ` | retention=${env.SESSION_CLEANUP_RETENTION_DAYS}d`
    );
  }

  return result.count;
}

// Two-step find-then-delete: Prisma deleteMany has no LIMIT; batching prevents large table locks.
export async function cleanupAllExpiredSessions(): Promise<number> {
  const cutoff = retentionCutoff();
  const batchSize = env.SESSION_CLEANUP_BATCH_SIZE;
  const deadWhere = {
    OR: [
      { expiresAt: { lt: cutoff } },
      { revokedAt: { lt: cutoff } },
    ],
  };

  let totalDeleted = 0;
  let batchNumber = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    batchNumber++;

    const rows = await prisma.userSession.findMany({
      where: deadWhere,
      select: { id: true },
      take: batchSize,
    });

    if (rows.length === 0) break;

    const result = await prisma.userSession.deleteMany({
      where: { id: { in: rows.map((r) => r.id) } },
    });

    totalDeleted += result.count;

    if (env.NODE_ENV !== 'production') {
      console.debug(
        `[SessionCleanup] batch ${batchNumber}` +
        ` | deleted=${result.count}` +
        ` | totalSoFar=${totalDeleted}`
      );
    }

    // If we got fewer rows than the batch size, this was the last batch.
    if (rows.length < batchSize) break;
  }

  return totalDeleted;
}
