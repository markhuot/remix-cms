/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `ComponentType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ComponentType_handle_key` ON `ComponentType`(`handle`);
