/*
  Warnings:

  - You are about to drop the `_UniversityToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UniversityToUser` DROP FOREIGN KEY `_UniversityToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UniversityToUser` DROP FOREIGN KEY `_UniversityToUser_B_fkey`;

-- DropTable
DROP TABLE `_UniversityToUser`;
