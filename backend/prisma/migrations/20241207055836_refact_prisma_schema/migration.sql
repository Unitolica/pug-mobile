/*
  Warnings:

  - You are about to drop the column `identifier` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `UniversitiesOnProjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnUniversities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `end` to the `timeLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `init` to the `timeLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UniversitiesOnProjects` DROP FOREIGN KEY `UniversitiesOnProjects_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `UniversitiesOnProjects` DROP FOREIGN KEY `UniversitiesOnProjects_universityId_fkey`;

-- DropForeignKey
ALTER TABLE `UserOnUniversities` DROP FOREIGN KEY `UserOnUniversities_universityId_fkey`;

-- DropForeignKey
ALTER TABLE `UserOnUniversities` DROP FOREIGN KEY `UserOnUniversities_userId_fkey`;

-- DropIndex
DROP INDEX `courses_identifier_universityId_key` ON `courses`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `identifier`;

-- AlterTable
ALTER TABLE `timeLogs` ADD COLUMN `end` DATETIME(3) NOT NULL,
    ADD COLUMN `init` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `UniversitiesOnProjects`;

-- DropTable
DROP TABLE `UserOnUniversities`;

-- CreateTable
CREATE TABLE `_UniversityToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UniversityToUser_AB_unique`(`A`, `B`),
    INDEX `_UniversityToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UniversityToUser` ADD CONSTRAINT `_UniversityToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UniversityToUser` ADD CONSTRAINT `_UniversityToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
