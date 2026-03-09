import cron from 'node-cron';
import { cleanupAllExpiredSessions } from '../utils/sessionCleanup';
import { env } from '../config/env';

export function startSessionCleanupJob(): void {
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
