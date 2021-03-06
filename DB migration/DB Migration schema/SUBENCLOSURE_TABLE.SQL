CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SUBENCLOSURE_TABLE` (
  `SE_ID` INT(10) NOT NULL,
  `Subenclosure` VARCHAR(50) NULL,
  `LocationID` INT(10) NULL,
  `GroupID` INT(10) NULL,
  PRIMARY KEY (`SE_ID`),
  INDEX `GroupID` (`GroupID` ASC),
  CONSTRAINT `LOCATION_TABLESUBENCLOSURE_TABLE`
    FOREIGN KEY (`LocationID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LOCATION_TABLE` (`LOCATIONID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)