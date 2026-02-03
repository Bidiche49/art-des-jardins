-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recoveryCodes" TEXT[],
ADD COLUMN     "twoFactorAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twoFactorLockedUntil" TIMESTAMP(3);
