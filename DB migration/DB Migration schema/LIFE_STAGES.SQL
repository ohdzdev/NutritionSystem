CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LIFE_STAGES` (
  `LifeStageID` INT(10) NOT NULL,
  `LifeStageCode` VARCHAR(255) NULL,
  `LifeStageName` VARCHAR(255) NULL,
  PRIMARY KEY (`LifeStageID`),
  INDEX `LifeStageCode` (`LifeStageCode` ASC))