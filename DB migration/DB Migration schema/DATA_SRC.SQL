CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DATA_SRC` (
  `DataSrc_ID` INT(10) NOT NULL,
  `Short_Form` VARCHAR(255) NULL,
  `Authors` VARCHAR(255) NULL,
  `Title` VARCHAR(255) NULL,
  `Year` VARCHAR(4) NULL,
  `Journal` VARCHAR(135) NULL,
  `Vol_City` VARCHAR(16) NULL,
  `Issue_State` VARCHAR(5) NULL,
  `Start_Page` VARCHAR(5) NULL,
  `End_Page` VARCHAR(5) NULL,
  INDEX `DataSrc_ID` (`DataSrc_ID` ASC),
  PRIMARY KEY (`DataSrc_ID`))