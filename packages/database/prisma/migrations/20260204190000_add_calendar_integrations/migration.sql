-- CreateEnum
CREATE TYPE "CalendarProvider" AS ENUM ('google', 'microsoft');

-- CreateTable
CREATE TABLE "calendar_integrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "CalendarProvider" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "lastSyncError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_integrations_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "interventions" ADD COLUMN "externalCalendarEventId" TEXT;

-- CreateIndex
CREATE INDEX "calendar_integrations_userId_idx" ON "calendar_integrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_integrations_userId_provider_key" ON "calendar_integrations"("userId", "provider");

-- AddForeignKey
ALTER TABLE "calendar_integrations" ADD CONSTRAINT "calendar_integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
