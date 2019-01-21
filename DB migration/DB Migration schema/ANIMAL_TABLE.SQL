CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`ANIMAL_TABLE` (
  `AnimalID` INT(10) NOT NULL,
  `AccessionNum` VARCHAR(255) NULL,
  `DIETID` INT(10) NULL,
  `LifeStage` VARCHAR(255) NULL,
  `HouseName` VARCHAR(255) NULL,
  INDEX `AccessionNum` (`AccessionNum` ASC),
  PRIMARY KEY (`AnimalID`),
  INDEX `AnimalID` (`AnimalID` ASC),
  CONSTRAINT `DIET TABLEANIMAL TABLE`
    FOREIGN KEY (`DIETID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)