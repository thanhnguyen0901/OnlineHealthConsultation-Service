CREATE TABLE "consultation_messages" (
    "id" UUID NOT NULL,
    "consultationSessionId" UUID NOT NULL,
    "senderUserId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "consultation_messages_consultationSessionId_createdAt_idx"
    ON "consultation_messages"("consultationSessionId", "createdAt");
CREATE INDEX "consultation_messages_senderUserId_createdAt_idx"
    ON "consultation_messages"("senderUserId", "createdAt");

ALTER TABLE "consultation_messages"
    ADD CONSTRAINT "consultation_messages_consultationSessionId_fkey"
    FOREIGN KEY ("consultationSessionId") REFERENCES "consultation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "consultation_messages"
    ADD CONSTRAINT "consultation_messages_senderUserId_fkey"
    FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
