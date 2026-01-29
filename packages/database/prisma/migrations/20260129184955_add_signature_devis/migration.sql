-- AlterEnum
ALTER TYPE "DevisStatut" ADD VALUE 'signe';

-- CreateTable
CREATE TABLE "signatures_devis" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "imageBase64" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "cgvAccepted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signatures_devis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signatures_devis_devisId_key" ON "signatures_devis"("devisId");

-- CreateIndex
CREATE UNIQUE INDEX "signatures_devis_token_key" ON "signatures_devis"("token");

-- CreateIndex
CREATE INDEX "signatures_devis_token_idx" ON "signatures_devis"("token");

-- CreateIndex
CREATE INDEX "signatures_devis_devisId_idx" ON "signatures_devis"("devisId");

-- AddForeignKey
ALTER TABLE "signatures_devis" ADD CONSTRAINT "signatures_devis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
