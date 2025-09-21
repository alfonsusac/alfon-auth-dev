/*
  Warnings:

  - Added the required column `name` to the `ProjectKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ProjectKey" ADD COLUMN     "name" TEXT NOT NULL;
