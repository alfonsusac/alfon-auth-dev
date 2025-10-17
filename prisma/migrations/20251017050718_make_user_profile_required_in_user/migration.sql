/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_profileuser_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_profileuser_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "user_profileuser_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "User_user_profileuser_id_key" ON "public"."User"("user_profileuser_id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_user_profileuser_id_fkey" FOREIGN KEY ("user_profileuser_id") REFERENCES "public"."UserProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
