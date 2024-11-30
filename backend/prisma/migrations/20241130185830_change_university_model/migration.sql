/*
  Warnings:

  - Made the column `name` on table `universities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `universities` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `internalobs` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
