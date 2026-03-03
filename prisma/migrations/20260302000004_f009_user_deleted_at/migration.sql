-- F-009: Add deletedAt to users table.
--
-- Semantics:
--   NULL         → account is (or was never) deactivated
--   <timestamp>  → account was deactivated at this time
--
-- The application layer (admin.service.ts) keeps isActive and deletedAt in
-- sync:
--   deactivate   → isActive = false,  deletedAt = NOW()
--   reactivate   → isActive = true,   deletedAt = NULL
--
-- An index on deletedAt supports fast "active users only" queries.

ALTER TABLE `users`
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

CREATE INDEX `users_deletedAt_idx` ON `users`(`deletedAt`);
