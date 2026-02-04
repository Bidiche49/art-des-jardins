-- CreateTable
CREATE TABLE "prestation_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPriceHT" DECIMAL(10,2) NOT NULL,
    "tvaRate" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestation_templates_pkey" PRIMARY KEY ("id")
);
