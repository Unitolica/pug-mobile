/*
  Warnings:

  - Added the required column `acronym` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internalobs` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `acronym` VARCHAR(191) NOT NULL,
    ADD COLUMN `identifier` VARCHAR(191) NOT NULL,
    ADD COLUMN `internalobs` VARCHAR(191) NOT NULL;
