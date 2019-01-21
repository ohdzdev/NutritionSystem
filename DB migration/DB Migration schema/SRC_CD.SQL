CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SRC_CD` (
  `Src_Cd` VARCHAR(2) NOT NULL,
  `SrcCd_Desc` VARCHAR(60) NULL,
  `Sort` INT(10) NULL,
  `Src_CdID` INT(10) NOT NULL,
  UNIQUE INDEX `Src_Cd` (`Src_Cd` ASC),
  PRIMARY KEY (`Src_Cd`))