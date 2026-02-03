-- CreateEnum
CREATE TYPE "RelanceLevel" AS ENUM ('rappel_amical', 'rappel_ferme', 'mise_en_demeure');

-- AlterTable - Add excludeRelance to clients
ALTER TABLE "clients" ADD COLUMN "excludeRelance" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable - Add excludeRelance to factures and index on dateEcheance
ALTER TABLE "factures" ADD COLUMN "excludeRelance" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "factures_dateEcheance_idx" ON "factures"("dateEcheance");

-- CreateTable
CREATE TABLE "relance_history" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "level" "RelanceLevel" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT,
    "joursRetard" INTEGER NOT NULL,
    "montantDu" DOUBLE PRECISION NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relance_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "relance_history_factureId_idx" ON "relance_history"("factureId");
CREATE INDEX "relance_history_level_idx" ON "relance_history"("level");
CREATE INDEX "relance_history_sentAt_idx" ON "relance_history"("sentAt");

-- AddForeignKey
ALTER TABLE "relance_history" ADD CONSTRAINT "relance_history_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE CASCADE ON UPDATE CASCADE;
