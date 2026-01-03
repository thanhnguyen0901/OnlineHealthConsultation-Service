-- AlterTable
ALTER TABLE `specialties` ADD COLUMN `nameEn` VARCHAR(255) NULL;
ALTER TABLE `specialties` ADD COLUMN `nameVi` VARCHAR(255) NULL;

-- Migrate existing data
UPDATE `specialties` SET 
  `nameEn` = `name`,
  `nameVi` = CASE `name`
    WHEN 'Cardiology' THEN 'Tim mạch'
    WHEN 'Dermatology' THEN 'Da liễu'
    WHEN 'Pediatrics' THEN 'Nhi khoa'
    WHEN 'Orthopedics' THEN 'Chấn thương chỉnh hình'
    WHEN 'General Medicine' THEN 'Đa khoa'
    ELSE `name`
  END;

-- Make columns NOT NULL after data migration
ALTER TABLE `specialties` MODIFY `nameEn` VARCHAR(255) NOT NULL;
ALTER TABLE `specialties` MODIFY `nameVi` VARCHAR(255) NOT NULL;
