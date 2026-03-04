/**
 * src/jobs/sessionCleanup.job.ts
 *
 * (Strategy A) Nightly cron that deletes globally dead sessions.
 *
 * Schedule: 02:00 every day (server local time).
 * Configurable via:
 *   SESSION_CLEANUP_RETENTION_DAYS (default 30) — grace window after expiry/revocation
 *   SESSION_CLEANUP_BATCH_SIZE     (default 500) — max rows deleted per batch iteration
 *
 * Initialise by calling startSessionCleanupJob() once from server.ts
 * after the database is connected.
 */

import cron from 'node-cron';
import { cleanupAllExpiredSessions } from '../utils/sessionCleanup';
import { env } from '../config/env';

export function startSessionCleanupJob(): void {
  // Run at 02:00 every day
  cron.schedule('0 2 * * *', async () => {
    const startedAt = new Date().toISOString();
    try {
      const deleted = await cleanupAllExpiredSessions();
      console.log(
        `[SessionCleanup] ${startedAt} – deleted ${deleted} dead session(s) ` +
        `(retention: ${env.SESSION_CLEANUP_RETENTION_DAYS}d, batch: ${env.SESSION_CLEANUP_BATCH_SIZE})`
      );
    } catch (err) {
      console.error(`[SessionCleanup] ${startedAt} – error during cleanup:`, err);
    }
  });

  console.log(
    `[SessionCleanup] Cron started – runs daily at 02:00 ` +
    `(retention: ${env.SESSION_CLEANUP_RETENTION_DAYS}d, batch: ${env.SESSION_CLEANUP_BATCH_SIZE})`
  );
}
