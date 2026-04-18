ALTER TABLE "notification_logs"
  ADD COLUMN "externalRef" TEXT;

CREATE UNIQUE INDEX "notification_logs_externalRef_key"
  ON "notification_logs"("externalRef");
