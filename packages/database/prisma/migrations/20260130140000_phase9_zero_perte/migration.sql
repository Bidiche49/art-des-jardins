-- Phase 9: Zero Perte / Resilience
-- Migration: Add EmailHistory, DocumentArchive, BackupHistory tables

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('pending', 'sent', 'failed', 'bounced');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('devis', 'devis_signe', 'facture', 'relance');

-- CreateTable
CREATE TABLE "email_history" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT,
    "bcc" TEXT,
    "subject" TEXT NOT NULL,
    "templateName" TEXT,
    "status" "EmailStatus" NOT NULL DEFAULT 'pending',
    "messageId" TEXT,
    "errorMessage" TEXT,
    "documentType" "DocumentType",
    "documentId" TEXT,
    "attachments" TEXT[],
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_archives" (
    "id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentNumero" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "checksum" TEXT,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "document_archives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backup_history" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backup_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_history_to_idx" ON "email_history"("to");

-- CreateIndex
CREATE INDEX "email_history_status_idx" ON "email_history"("status");

-- CreateIndex
CREATE INDEX "email_history_documentId_idx" ON "email_history"("documentId");

-- CreateIndex
CREATE INDEX "email_history_createdAt_idx" ON "email_history"("createdAt");

-- CreateIndex
CREATE INDEX "document_archives_documentType_idx" ON "document_archives"("documentType");

-- CreateIndex
CREATE INDEX "document_archives_documentId_idx" ON "document_archives"("documentId");

-- CreateIndex
CREATE INDEX "document_archives_documentNumero_idx" ON "document_archives"("documentNumero");

-- CreateIndex
CREATE INDEX "document_archives_archivedAt_idx" ON "document_archives"("archivedAt");

-- CreateIndex
CREATE INDEX "backup_history_createdAt_idx" ON "backup_history"("createdAt");
