/*
  Warnings:

  - You are about to drop the column `callback_url` on the `Domain` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[origin]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `origin` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Domain" DROP COLUMN "callback_url",
ADD COLUMN     "origin" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Domain_origin_key" ON "public"."Domain"("origin");
