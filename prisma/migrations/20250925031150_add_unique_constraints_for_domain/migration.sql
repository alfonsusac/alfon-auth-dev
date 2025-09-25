/*
  Warnings:

  - A unique constraint covering the columns `[project_id,origin]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Domain_project_id_origin_key" ON "public"."Domain"("project_id", "origin");
