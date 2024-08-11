-- AlterTable
ALTER TABLE `habit` ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `description` VARCHAR(191) NULL;
