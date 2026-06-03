-- CreateEnum
CREATE TYPE "CongestionLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "traffic_zones" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "radius" DECIMAL(10,2) NOT NULL,
    "vehicle_count" INTEGER NOT NULL DEFAULT 0,
    "density" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "congestion_level" "CongestionLevel" NOT NULL DEFAULT 'LOW',
    "is_congested" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traffic_zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "traffic_zones_name_key" ON "traffic_zones"("name");

-- CreateIndex
CREATE INDEX "traffic_zones_congestion_level_idx" ON "traffic_zones"("congestion_level");

-- CreateIndex
CREATE INDEX "traffic_zones_is_congested_idx" ON "traffic_zones"("is_congested");
