/*
  Warnings:

  - You are about to drop the column `callbackURI` on the `ProjectKey` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ProjectKey` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `ProjectKey` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `ProjectKey` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `ProjectKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[client_secret]` on the table `ProjectKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_secret` to the `ProjectKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `ProjectKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProjectKey" DROP CONSTRAINT "ProjectKey_projectId_fkey";

-- DropIndex
DROP INDEX "public"."ProjectKey_key_key";

-- AlterTable
ALTER TABLE "public"."ProjectKey" DROP COLUMN "callbackURI",
DROP COLUMN "description",
DROP COLUMN "domain",
DROP COLUMN "key",
DROP COLUMN "projectId",
ADD COLUMN     "client_secret" TEXT NOT NULL,
ADD COLUMN     "project_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "callback_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_project_id_redirect_url_key" ON "public"."Domain"("project_id", "redirect_url");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectKey_client_secret_key" ON "public"."ProjectKey"("client_secret");

-- AddForeignKey
ALTER TABLE "public"."ProjectKey" ADD CONSTRAINT "ProjectKey_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Domain" ADD CONSTRAINT "Domain_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
