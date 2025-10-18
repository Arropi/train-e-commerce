/*
  Warnings:

  - You are about to drop the column `identity` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `booking_user_id_foreign_key`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_time_session_foreign`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_user_foreign`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_user_update_foreign`;

-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `special_session` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `information` TEXT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `identity`,
    ADD COLUMN `img_url` VARCHAR(255) NULL,
    ADD COLUMN `nim` VARCHAR(255) NULL,
    ADD COLUMN `prodi` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `bookings`;

-- CreateTable
CREATE TABLE `reserves` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `pic` VARCHAR(255) NOT NULL,
    `status` ENUM('process', 'approve', 'rejected', 'canceled', 'Waiting to be return', 'done') NOT NULL DEFAULT 'process',
    `tanggal` DATE NOT NULL,
    `session_id` BIGINT UNSIGNED NOT NULL,
    `inventories_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `updated_by` BIGINT UNSIGNED NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reserves` ADD CONSTRAINT `reserves_user_foreign` FOREIGN KEY (`inventories_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reserves` ADD CONSTRAINT `reserves_user_update_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reserves` ADD CONSTRAINT `reserves_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reserves` ADD CONSTRAINT `reserves_time_session_foreign` FOREIGN KEY (`session_id`) REFERENCES `time_sessions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
