-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('ACCIDENT', 'TRAVAUX', 'ROUTE_FERMEE', 'EMBOUTEILLAGE');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('SIGNALE', 'EN_COURS', 'RESOLU');

-- CreateTable
CREATE TABLE "incidents" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "type" "IncidentType" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'SIGNALE',
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "address" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incidents_type_idx" ON "incidents"("type");

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");
