/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tutorial_group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tutorial_group_name_key" ON "tutorial_group"("name");
