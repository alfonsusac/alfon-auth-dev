/*
  Warnings:

  - You are about to drop the column `user_profileuser_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_user_profileuser_id_fkey";

-- DropIndex
DROP INDEX "public"."User_user_profileuser_id_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "user_profileuser_id",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "public"."UserProfile";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
