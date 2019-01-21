CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`WEEKDAYS` (
  `WeekdayID` INT(10) NOT NULL,
  `SameDayTxt` VARCHAR(255) NULL,
  `NextDayTxt` VARCHAR(255) NULL,
  INDEX `DayNum` (`SameDayTxt` ASC),
  INDEX `WeekdayID` (`WeekdayID` ASC),
  PRIMARY KEY (`WeekdayID`))