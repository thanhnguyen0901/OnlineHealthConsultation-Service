/**
 * src/utils/sessionCleanup.ts
 *
 * Shared session-cleanup logic consumed by both:
 *   A) the nightly cron job        (src/jobs/sessionCleanup.job.ts)
 *   B) inline per-user cleanup     (auth.service.ts – fired on login/refresh)
 *
 * Retention policy
 * ─────────────────
 * A "dead" session is one where the session has BOTH ended (expired OR revoked)
 * AND is older than SESSION_CLEANUP_RETENTION_DAYS past that end date.
 * This small grace window allows short-term audit/debugging before rows vanish.
 *
 * Rows deleted when EITHER:
 *   expiresAt  < now - retention   (session expired and grace period passed)
 *   revokedAt  < now - retention   (session revoked and grace period passed)
 *
 * For revoked-but-not-yet-expired rows, the revokedAt threshold applies so
 * security-revoked sessions are also cleaned up after the grace window.
 */

import prisma from '../config/db';
import { env } from '../config/env';

/** Returns the cutoff Date based on configured retention */
function retentionCutoff(): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - env.SESSION_CLEANUP_RETENTION_DAYS);
  return cutoff;
}

/**
 * (Strategy B) Delete dead sessions for a single user.
 * Cheap: scoped to one userId; safe to fire-and-forget.
 *
 * Dead = expired past retention window OR revoked past retention window.
 *
 * @returns number of deleted rows (for logging)
 */
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

/**
 * (Strategy A) Delete dead sessions across ALL users in bounded batches.
 * Intended for the nightly cron job.
 *
 * Uses a two-step find-then-delete pattern because Prisma's deleteMany does
 * not support LIMIT. Each iteration deletes at most SESSION_CLEANUP_BATCH_SIZE
 * rows, preventing large DELETE statements that would hold long table locks.
 *
 * @returns total number of deleted rows across all batches
 */
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

    // Step 1: Fetch up to batchSize IDs that match the dead-session criteria.
    // A projection-only query (select: { id }) is cheap and avoids reading
    // large text fields (userAgent) for rows we are about to delete.
    const rows = await prisma.userSession.findMany({
      where: deadWhere,
      select: { id: true },
      take: batchSize,
    });

    if (rows.length === 0) break; // Nothing left to delete.

    // Step 2: Delete exactly those IDs — atomic within this batch.
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
