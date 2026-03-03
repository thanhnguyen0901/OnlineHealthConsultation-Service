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

  return result.count;
}

/**
 * (Strategy A) Delete dead sessions across ALL users.
 * Intended for the nightly cron job.
 *
 * @returns number of deleted rows
 */
export async function cleanupAllExpiredSessions(): Promise<number> {
  const cutoff = retentionCutoff();

  const result = await prisma.userSession.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: cutoff } },
        { revokedAt: { lt: cutoff } },
      ],
    },
  });

  return result.count;
}
