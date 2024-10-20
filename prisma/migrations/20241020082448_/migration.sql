/*
  Warnings:

  - You are about to drop the `_coursetouniversity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_coursetouniversity` DROP FOREIGN KEY `_CourseToUniversity_A_fkey`;

-- DropForeignKey
ALTER TABLE `_coursetouniversity` DROP FOREIGN KEY `_CourseToUniversity_B_fkey`;

-- DropTable
DROP TABLE `_coursetouniversity`;

-- CreateTable
CREATE TABLE `UnivertiesOnCourses` (
    `courseId` VARCHAR(191) NOT NULL,
    `universityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`courseId`, `universityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UnivertiesOnCourses` ADD CONSTRAINT `UnivertiesOnCourses_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UnivertiesOnCourses` ADD CONSTRAINT `UnivertiesOnCourses_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
