CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`CASE_NOTES` (
  `CaseNotesID` INT(10) NOT NULL,
  `CaseDate` DATETIME NULL,
  `DietID` INT(10) NULL,
  `BCS` INT(10) NULL,
  `CaseNote` LONGTEXT NULL,
  PRIMARY KEY (`CaseNotesID`),
  INDEX `CaseNotesID` (`CaseNotesID` ASC),
  CONSTRAINT `DIET_TABLECASE_NOTES`
    FOREIGN KEY (`DietID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)