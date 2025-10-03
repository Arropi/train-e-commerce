/*
  Warnings:

  - Added the required column `invetories_id` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carts` ADD COLUMN `invetories_id` BIGINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_id_inventories_foreign` FOREIGN KEY (`invetories_id`) REFERENCES `inventories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
