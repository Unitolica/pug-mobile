-- CreateTable
CREATE TABLE `UserOnUniversities` (
    `universityId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`universityId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOnUniversities` ADD CONSTRAINT `UserOnUniversities_universityId_fkey` FOREIGN KEY (`universityId`) REFERENCES `universities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOnUniversities` ADD CONSTRAINT `UserOnUniversities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
