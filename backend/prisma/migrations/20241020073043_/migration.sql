-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('STUDENT', 'PROFESSOR', 'ENTITY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    ADD COLUMN `universityId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `universities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timeLogs` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` VARCHAR(191) NULL,
    `requestedById` VARCHAR(191) NULL,
    `approvedById` VARCHAR(191) NULL,
    `deniedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UniversityToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UniversityToUser_AB_unique`(`A`, `B`),
    INDEX `_UniversityToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToUser_AB_unique`(`A`, `B`),
    INDEX `_CourseToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToUniversity` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToUniversity_AB_unique`(`A`, `B`),
    INDEX `_CourseToUniversity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CourseToProject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToProject_AB_unique`(`A`, `B`),
    INDEX `_CourseToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectToUniversity` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectToUniversity_AB_unique`(`A`, `B`),
    INDEX `_ProjectToUniversity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `timeLogs` ADD CONSTRAINT `timeLogs_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeLogs` ADD CONSTRAINT `timeLogs_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeLogs` ADD CONSTRAINT `timeLogs_deniedById_fkey` FOREIGN KEY (`deniedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `timeLogs` ADD CONSTRAINT `timeLogs_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UniversityToUser` ADD CONSTRAINT `_UniversityToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UniversityToUser` ADD CONSTRAINT `_UniversityToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUser` ADD CONSTRAINT `_CourseToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUser` ADD CONSTRAINT `_CourseToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUniversity` ADD CONSTRAINT `_CourseToUniversity_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToUniversity` ADD CONSTRAINT `_CourseToUniversity_B_fkey` FOREIGN KEY (`B`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToProject` ADD CONSTRAINT `_CourseToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToProject` ADD CONSTRAINT `_CourseToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToUniversity` ADD CONSTRAINT `_ProjectToUniversity_A_fkey` FOREIGN KEY (`A`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToUniversity` ADD CONSTRAINT `_ProjectToUniversity_B_fkey` FOREIGN KEY (`B`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToUser` ADD CONSTRAINT `_ProjectToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToUser` ADD CONSTRAINT `_ProjectToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
