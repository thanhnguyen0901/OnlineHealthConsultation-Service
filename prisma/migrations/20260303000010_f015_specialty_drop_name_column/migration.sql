-- RISK-06: Drop the redundant `specialties.name` column (legacy alias of nameEn)
-- Rationale: The column duplicated nameEn with no DB-level enforcement.
-- Any direct DB write could silently drift the two values.  Removing the
-- column eliminates drift permanently.  nameEn is promoted to the unique
-- identifier; all service code already reads nameEn exclusively.
--
-- Zero-downtime strategy: InnoDB online DDL (INPLACE, LOCK=NONE) where
-- possible.  DROP COLUMN on an indexed column requires a table rebuild
-- but MySQL 8 performs this online for InnoDB tables unless row format
-- constraints apply.

-- Step 1: Drop the unique index on `name`
ALTER TABLE `specialties`
  DROP INDEX `specialties_name_key`;

-- Step 2: Add a unique index on `nameEn` (mirrors Prisma @unique)
ALTER TABLE `specialties`
  ADD UNIQUE INDEX `specialties_nameEn_key` (`nameEn`);

-- Step 3: Drop the column (table rebuild — runs online in MySQL 8 InnoDB)
ALTER TABLE `specialties`
  DROP COLUMN `name`;
