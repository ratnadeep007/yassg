/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `PageData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PageData_path_key" ON "PageData"("path");
