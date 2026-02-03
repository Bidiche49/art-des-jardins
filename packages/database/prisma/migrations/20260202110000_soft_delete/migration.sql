-- AlterTable - Add deletedAt to clients
ALTER TABLE "clients" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "clients_deletedAt_idx" ON "clients"("deletedAt");

-- AlterTable - Add deletedAt to chantiers
ALTER TABLE "chantiers" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "chantiers_deletedAt_idx" ON "chantiers"("deletedAt");

-- AlterTable - Add deletedAt to devis
ALTER TABLE "devis" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "devis_deletedAt_idx" ON "devis"("deletedAt");

-- AlterTable - Add deletedAt to factures
ALTER TABLE "factures" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "factures_deletedAt_idx" ON "factures"("deletedAt");

-- AlterTable - Add deletedAt to interventions
ALTER TABLE "interventions" ADD COLUMN "deletedAt" TIMESTAMP(3);
CREATE INDEX "interventions_deletedAt_idx" ON "interventions"("deletedAt");
