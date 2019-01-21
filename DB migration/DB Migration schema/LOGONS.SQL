CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LOGONS` (
  `LoginID` INT(10) NOT NULL,
  `WindowsLogon` VARCHAR(255) NULL,
  `LogonDate` DATETIME NULL,
  `LogoffDate` DATETIME NULL,
  `DBType` VARCHAR(255) NULL,
  INDEX `WindowsLogon` (`WindowsLogon` ASC),
  PRIMARY KEY (`LoginID`),
  INDEX `LoginID` (`LoginID` ASC))