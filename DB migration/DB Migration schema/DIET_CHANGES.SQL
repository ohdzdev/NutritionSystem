CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_CHANGES` (
  `DietChangeID` INT(10) NOT NULL,
  `DietChangeDate` DATETIME NULL,
  `DietChangeTime` INT(10) NULL,
  `DietChangeReason` LONGTEXT NULL,
  `DietID` INT(10) NULL,
  `BGTUserID` VARCHAR(255) NULL,
  INDEX `DietChangeDate` (`DietChangeDate` ASC),
  INDEX `DietID` (`DietID` ASC),
  INDEX `DietChangeTime` (`DietChangeTime` ASC),
  INDEX `BGTUserID` (`BGTUserID` ASC),
  INDEX `ChangeID` (`DietChangeID` ASC),
  PRIMARY KEY (`DietChangeID`),
  CONSTRAINT `DIET_TABLEDIET_CHANGES`
    FOREIGN KEY (`DietID`)
	REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
	ON DELETE CASCADE
  ON UPDATE CASCADE)