/*
  Warnings:

  - You are about to drop the `UniversitiesOnCourses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identifier,universityId]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `universityId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UniversitiesOnCourses` DROP FOREIGN KEY `UniversitiesOnCourses_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `UniversitiesOnCourses` DROP FOREIGN KEY `UniversitiesOnCourses_universityId_fkey`;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `universityId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `UniversitiesOnCourses`;

-- CreateIndex
CREATE UNIQUE INDEX `courses_identifier_universityId_key` ON `courses`(`identifier`, `universityId`);

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
