/*
  Warnings:

  - Added the required column `status` to the `UsersOnProjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UsersOnProjects` ADD COLUMN `status` ENUM('REQUESTED', 'ACCEPTED', 'REJECTED') NOT NULL;
