CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`BUDGET_ID_TABLE` (
  `BUDGETID` INT(10) NOT NULL,
  `BUDGETCODE` VARCHAR(255) NULL,
  INDEX `BUDGETCODEID` (`BUDGETID` ASC),
  INDEX `BUDGETID` (`BUDGETCODE` ASC),
  PRIMARY KEY (`BUDGETID`))