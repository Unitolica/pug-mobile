/*
  Warnings:

  - You are about to drop the `univertiesoncourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `univertiesoncourses` DROP FOREIGN KEY `UnivertiesOnCourses_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `univertiesoncourses` DROP FOREIGN KEY `UnivertiesOnCourses_universityId_fkey`;

-- DropTable
DROP TABLE `univertiesoncourses`;

-- CreateTable
CREATE TABLE `UniversitiesOnCourses` (
    `courseId` VARCHAR(191) NOT NULL,
    `universityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`courseId`, `universityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UniversitiesOnCourses` ADD CONSTRAINT `UniversitiesOnCourses_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UniversitiesOnCourses` ADD CONSTRAINT `UniversitiesOnCourses_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
