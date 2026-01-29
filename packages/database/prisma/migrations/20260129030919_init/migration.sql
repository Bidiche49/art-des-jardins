-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('particulier', 'professionnel', 'syndic');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('patron', 'employe');

-- CreateEnum
CREATE TYPE "ChantierStatut" AS ENUM ('lead', 'visite_planifiee', 'devis_envoye', 'accepte', 'planifie', 'en_cours', 'termine', 'facture', 'annule');

-- CreateEnum
CREATE TYPE "TypePrestation" AS ENUM ('paysagisme', 'entretien', 'elagage', 'abattage', 'tonte', 'taille', 'autre');

-- CreateEnum
CREATE TYPE "DevisStatut" AS ENUM ('brouillon', 'envoye', 'accepte', 'refuse', 'expire');

-- CreateEnum
CREATE TYPE "FactureStatut" AS ENUM ('brouillon', 'envoyee', 'payee', 'annulee');

-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('virement', 'cheque', 'especes', 'carte');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'employe',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "avatarUrl" TEXT,
    "derniereConnexion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "raisonSociale" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "telephoneSecondaire" TEXT,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "notes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chantiers" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "typePrestation" "TypePrestation"[],
    "description" TEXT NOT NULL,
    "surface" DOUBLE PRECISION,
    "statut" "ChantierStatut" NOT NULL DEFAULT 'lead',
    "dateVisite" TIMESTAMP(3),
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "responsableId" TEXT,
    "notes" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chantiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devis" (
    "id" TEXT NOT NULL,
    "chantierId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateValidite" TIMESTAMP(3) NOT NULL,
    "totalHT" DOUBLE PRECISION NOT NULL,
    "totalTVA" DOUBLE PRECISION NOT NULL,
    "totalTTC" DOUBLE PRECISION NOT NULL,
    "statut" "DevisStatut" NOT NULL DEFAULT 'brouillon',
    "dateAcceptation" TIMESTAMP(3),
    "signatureClient" TEXT,
    "pdfUrl" TEXT,
    "conditionsParticulieres" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_devis" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnitaireHT" DOUBLE PRECISION NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "montantHT" DOUBLE PRECISION NOT NULL,
    "montantTTC" DOUBLE PRECISION NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lignes_devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factures" (
    "id" TEXT NOT NULL,
    "devisId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEcheance" TIMESTAMP(3) NOT NULL,
    "datePaiement" TIMESTAMP(3),
    "totalHT" DOUBLE PRECISION NOT NULL,
    "totalTVA" DOUBLE PRECISION NOT NULL,
    "totalTTC" DOUBLE PRECISION NOT NULL,
    "statut" "FactureStatut" NOT NULL DEFAULT 'brouillon',
    "modePaiement" "ModePaiement",
    "referencePaiement" TEXT,
    "pdfUrl" TEXT,
    "mentionsLegales" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_factures" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnitaireHT" DOUBLE PRECISION NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL,
    "montantHT" DOUBLE PRECISION NOT NULL,
    "montantTTC" DOUBLE PRECISION NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lignes_factures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "chantierId" TEXT NOT NULL,
    "employeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "heureDebut" TIMESTAMP(3) NOT NULL,
    "heureFin" TIMESTAMP(3),
    "dureeMinutes" INTEGER,
    "description" TEXT,
    "photos" TEXT[],
    "notes" TEXT,
    "valide" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entite" TEXT NOT NULL,
    "entiteId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequences" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "clients_type_idx" ON "clients"("type");

-- CreateIndex
CREATE INDEX "clients_ville_idx" ON "clients"("ville");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- CreateIndex
CREATE INDEX "chantiers_clientId_idx" ON "chantiers"("clientId");

-- CreateIndex
CREATE INDEX "chantiers_statut_idx" ON "chantiers"("statut");

-- CreateIndex
CREATE INDEX "chantiers_responsableId_idx" ON "chantiers"("responsableId");

-- CreateIndex
CREATE INDEX "chantiers_dateDebut_idx" ON "chantiers"("dateDebut");

-- CreateIndex
CREATE UNIQUE INDEX "devis_numero_key" ON "devis"("numero");

-- CreateIndex
CREATE INDEX "devis_chantierId_idx" ON "devis"("chantierId");

-- CreateIndex
CREATE INDEX "devis_statut_idx" ON "devis"("statut");

-- CreateIndex
CREATE INDEX "devis_numero_idx" ON "devis"("numero");

-- CreateIndex
CREATE INDEX "lignes_devis_devisId_idx" ON "lignes_devis"("devisId");

-- CreateIndex
CREATE UNIQUE INDEX "factures_numero_key" ON "factures"("numero");

-- CreateIndex
CREATE INDEX "factures_devisId_idx" ON "factures"("devisId");

-- CreateIndex
CREATE INDEX "factures_statut_idx" ON "factures"("statut");

-- CreateIndex
CREATE INDEX "factures_numero_idx" ON "factures"("numero");

-- CreateIndex
CREATE INDEX "lignes_factures_factureId_idx" ON "lignes_factures"("factureId");

-- CreateIndex
CREATE INDEX "interventions_chantierId_idx" ON "interventions"("chantierId");

-- CreateIndex
CREATE INDEX "interventions_employeId_idx" ON "interventions"("employeId");

-- CreateIndex
CREATE INDEX "interventions_date_idx" ON "interventions"("date");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entite_idx" ON "audit_logs"("entite");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "sequences_prefix_year_key" ON "sequences"("prefix", "year");

-- AddForeignKey
ALTER TABLE "chantiers" ADD CONSTRAINT "chantiers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chantiers" ADD CONSTRAINT "chantiers_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devis" ADD CONSTRAINT "devis_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "chantiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_devis" ADD CONSTRAINT "lignes_devis_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_devisId_fkey" FOREIGN KEY ("devisId") REFERENCES "devis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_factures" ADD CONSTRAINT "lignes_factures_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "chantiers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
