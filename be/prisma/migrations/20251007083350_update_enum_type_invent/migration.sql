/*
  Warnings:

  - Made the column `type` on table `inventories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `inventories` MODIFY `type` ENUM('praktikum', 'projek') NOT NULL;
