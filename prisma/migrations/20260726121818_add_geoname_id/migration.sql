/*
  Warnings:

  - A unique constraint covering the columns `[geonameId]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `geonameId` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cities_slug_countryId_key";

-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "geonameId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cities_geonameId_key" ON "cities"("geonameId");

-- CreateIndex
CREATE INDEX "cities_slug_idx" ON "cities"("slug");

-- CreateIndex
CREATE INDEX "cities_slug_countryId_idx" ON "cities"("slug", "countryId");
