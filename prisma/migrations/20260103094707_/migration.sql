/*
  Warnings:

  - You are about to alter the column `nameEn` on the `specialties` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `nameVi` on the `specialties` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `specialties` MODIFY `nameEn` VARCHAR(191) NOT NULL,
    MODIFY `nameVi` VARCHAR(191) NOT NULL;
