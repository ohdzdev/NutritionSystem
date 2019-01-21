-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: AnimalDietDatabase_OHDZA_be_ufe_combined
-- Source Schemata: AnimalDietDatabase_OHDZA_be_ufe_combined
-- Created: Sun Jan 20 21:02:42 2019
-- Workbench Version: 8.0.13
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema AnimalDietDatabase_OHDZA_be_ufe_combined
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined` ;
CREATE SCHEMA IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined` ;

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.CASE_NOTES
-- ----------------------------------------------------------------------------
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
    ON UPDATE CASCADE);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.SPECI_INSTRUC_FOOD_ITEM
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SPECI_INSTRUC_FOOD_ITEM` (
--   `SIID` INT(10) NOT NULL,
--   `INSTRUCTIONS` VARCHAR(50) NULL,
--   `ShortForm` VARCHAR(255) NULL,
--   INDEX `SIID` (`SIID` ASC),
--   PRIMARY KEY (`SIID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.BUDGET_ID_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`BUDGET_ID_TABLE` (
  `BUDGETID` INT(10) NOT NULL,
  `BUDGETCODE` VARCHAR(255) NULL,
  INDEX `BUDGETCODEID` (`BUDGETID` ASC),
  INDEX `BUDGETID` (`BUDGETCODE` ASC),
  PRIMARY KEY (`BUDGETID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.FOOD_CATEGORY_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_CATEGORY_TABLE` (
  `CATEGORYID` INT(10) NOT NULL,
  `FOOD CATEGORY` VARCHAR(50) NULL,
  `SORTORDER` INT(10) NULL,
  INDEX `FOOD CATEGORY TABLEFOOD CATEGORY` (`FOOD CATEGORY` ASC),
  PRIMARY KEY (`CATEGORYID`),
  INDEX `CATEGORYID` (`CATEGORYID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.PARK_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`PARK_TABLE` (
  `PARKID` INT(10) NOT NULL,
  `PARK` VARCHAR(50) NULL,
  `ShortPark` VARCHAR(255) NULL,
  INDEX `PARKID` (`PARKID` ASC),
  PRIMARY KEY (`PARKID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DIET_HISTORY
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_HISTORY` (
--   `DIETHISTORYID` INT(10) NOT NULL,
--   `DIETID` INT(10) NULL,
--   `SPECIESID` INT(10) NULL,
--   `CURRENT` TINYINT(1) NOT NULL,
--   `BGTUSERID` VARCHAR(255) NULL,
--   `TABLEID` INT(10) NULL,
--   `DATE` DATETIME NULL,
--   `PARKID` INT(10) NULL,
--   `NOTEID` VARCHAR(28) NULL,
--   `LABEL` TINYINT(1) NOT NULL,
--   `DCID` INT(10) NULL,
--   `NCPREPARES` TINYINT(1) NOT NULL,
--   INDEX `DIETHISTORYID` (`DIETHISTORYID` ASC),
--   INDEX `ENTERED BY` (`BGTUSERID` ASC),
--   INDEX `DCID` (`DCID` ASC),
--   INDEX `NOTEID` (`NOTEID` ASC),
--   INDEX `PARKID` (`PARKID` ASC),
--   INDEX `TABLEID` (`TABLEID` ASC),
--   INDEX `SPECIESID` (`SPECIESID` ASC),
--   PRIMARY KEY (`DIETHISTORYID`),
--   CONSTRAINT `DIET_TABLEDIET_HISTORY`
--     FOREIGN KEY (`DIETID`)
--     REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
--     ON DELETE CASCADE
--     ON UPDATE CASCADE);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DIET_SUB_HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_HISTORY2` (
  `ID` INT(10) NOT NULL,
  `StartDate` DATETIME NULL,
  `DIETID` INT(10) NULL,
  `FOODID` INT(10) NULL,
  `AMOUNT` DOUBLE NULL,
  `UNITID` INT(10) NULL,
  `SU` TINYINT(1) NOT NULL,
  `M` TINYINT(1) NOT NULL,
  `T` TINYINT(1) NOT NULL,
  `W` TINYINT(1) NOT NULL,
  `R` TINYINT(1) NOT NULL,
  `F` TINYINT(1) NOT NULL,
  `S` TINYINT(1) NOT NULL,
  `SORT` INT(10) NULL,
  `TOTE` INT(10) NULL,
  `FEEDING` INT(10) NULL,
  `LINENOTES` VARCHAR(255) NULL,
  `BGTUserID` VARCHAR(255) NULL,
  `IND_AMOUNT` INT(10) NULL,
  `NUM_ANIMALS` INT(10) NULL,
  `FRQ_WEEKS` INT(10) NULL,
  `FRQ_ROTATION` INT(10) NULL,
  INDEX `FOODID` (`FOODID` ASC),
  INDEX `BGTUserID` (`BGTUserID` ASC),
  INDEX `NUM_ANIMALS` (`NUM_ANIMALS` ASC),
  PRIMARY KEY (`ID`),
  INDEX `UNITID` (`UNITID` ASC),
  INDEX `ID` (`ID` ASC),
  CONSTRAINT `DIET TABLETblDietSubHistory`
    FOREIGN KEY (`DIETID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `UNIT_TABLEDIET_SUB_HISTORY`
    FOREIGN KEY (`UNITID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`UNIT_TABLE` (`UNITID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `FOOD_TABLEDIET_SUB_HISTORY`
    FOREIGN KEY (`FOODID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_TABLE` (`FOODID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `EMPLOYEE_TABLEDIET_SUB_HISTORY`
    FOREIGN KEY (`BGTUserID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`EMPLOYEE_TABLE` (`UserLogin`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.SRC_CD
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SRC_CD` (
  `Src_Cd` VARCHAR(2) NOT NULL,
  `SrcCd_Desc` VARCHAR(60) NULL,
  `Sort` INT(10) NULL,
  `Src_CdID` INT(10) NOT NULL,
  UNIQUE INDEX `Src_Cd` (`Src_Cd` ASC),
  PRIMARY KEY (`Src_Cd`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.TOMORROW_DIET_SUB
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`TOMORROW_DIET_SUB` (
  `DIETID` INT(10) NOT NULL,
  `FEEDING` INT(10) NULL,
  `FOODID` INT(10) NULL,
  `GROUP_AMOUNT` DOUBLE NULL,
  `UNITID` INT(10) NULL,
  `SORT` INT(10) NULL,
  `TOTE` INT(10) NULL,
  `FOOD` VARCHAR(50) NULL,
  `UNIT` VARCHAR(50) NULL,
  `LINENOTES` VARCHAR(255) NULL,
  `MEAT` INT(10) NULL,
  `TABLEID` INT(10) NULL,
  `TARGETTABLE` INT(10) NULL,
  `DC_SORTORDER` INT(10) NULL,
  INDEX `UNITID` (`UNITID` ASC),
  INDEX `TABLEID` (`TABLEID` ASC),
  INDEX `FOODID` (`FOODID` ASC),
  INDEX `DIETID` (`DIETID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.ANIMAL_TABLE
-- ----------------------------------------------------------------------------
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
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.SETTINGS
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SETTINGS` (
--   `SettingsID` INT(10) NOT NULL,
--   `SettingName` VARCHAR(255) NULL,
--   `SettingValue` VARCHAR(255) NULL,
--   `SettingDescription` VARCHAR(255) NULL,
--   PRIMARY KEY (`SettingsID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.SPECIES_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SPECIES_TABLE` (
  `SPECIESID` INT(10) NOT NULL,
  `SPECIES` VARCHAR(255) NULL,
  `SCIENTIFIC NAME` VARCHAR(255) NULL,
  `CATEGORY` VARCHAR(255) NULL,
  `TYPE` VARCHAR(255) NULL,
  `SPECIESCATID` INT(10) NULL,
  `IMAGELINK` VARCHAR(255) NULL,
  UNIQUE INDEX `SPECIESID` (`SPECIESID` ASC),
  INDEX `SPECIESCATID` (`SPECIESCATID` ASC),
  PRIMARY KEY (`SPECIESID`),
  UNIQUE INDEX `SPECIES` (`SPECIES` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.WEIGHT_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`WEIGHT_TABLE` (
  `WeightID` INT(10) NOT NULL,
  `FoodID` INT(10) NULL,
  `WtAmount` DOUBLE NULL,
  `UnitIDNum` INT(10) NULL,
  `Gm_Wgt` DOUBLE NULL,
  INDEX `UnitIDNum` (`UnitIDNum` ASC),
  PRIMARY KEY (`WeightID`),
  CONSTRAINT `FOOD TABLEWEIGHT TABLE`
    FOREIGN KEY (`FoodID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_TABLE` (`FOODID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `UNIT TABLEWEIGHT TABLE`
    FOREIGN KEY (`UnitIDNum`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`UNIT_TABLE` (`UNITID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.FOOD_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_TABLE` (
  `FOODID` INT(10) NOT NULL,
  `SciName` VARCHAR(255) NULL,
  `ManufacName` VARCHAR(255) NULL,
  `OHDZName` VARCHAR(255) NULL,
  `FOOD` VARCHAR(50) NULL,
  `COSTg` DOUBLE NULL,
  `BUDGETID` INT(10) NULL,
  `FOOD CATEGORY` INT(10) NULL,
  `USDA_FdGrp_Desc` VARCHAR(255) NULL,
  `DRY` TINYINT(1) NOT NULL,
  `MEAT` TINYINT(1) NOT NULL,
  `PRECHOP` TINYINT(1) NOT NULL,
  `PREBAG` TINYINT(1) NOT NULL,
  `Active` TINYINT(1) NOT NULL,
  INDEX `FOODID` (`FOODID` ASC),
  INDEX `OLD_EARS_ID` (`USDA_FdGrp_Desc` ASC),
  UNIQUE INDEX `FOOD` (`FOOD` ASC),
  PRIMARY KEY (`FOODID`),
  CONSTRAINT `BUDGET_ID_TABLEFOOD_TABLE`
    FOREIGN KEY (`BUDGETID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`BUDGET_ID_TABLE` (`BUDGETID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `FOOD CATEGORY TABLEFOOD TABLE`
    FOREIGN KEY (`FOOD CATEGORY`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_CATEGORY_TABLE` (`CATEGORYID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.NUTR_DEF
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`NUTR_DEF` (
  `Nutr_No` VARCHAR(255) NULL,
  `Units` VARCHAR(7) NULL,
  `Tagname` VARCHAR(20) NULL,
  `NutrDesc` VARCHAR(60) NULL,
  `Num_Dec` VARCHAR(1) NULL,
  `SR_Order` DOUBLE NULL,
  `BGT_Name` VARCHAR(255) NULL,
  `NUTR_DEFID` INT(10) NOT NULL,
  INDEX `NUTR_DEFID` (`NUTR_DEFID` ASC),
  INDEX `Num_Dec` (`Num_Dec` ASC),
  PRIMARY KEY (`NUTR_DEFID`),
  UNIQUE INDEX `Nutr_No` (`Nutr_No` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DIET_SUB_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_SUB_TABLE` (
  `ID` INT(10) NOT NULL,
  `DIETID` INT(10) NULL,
  `FOODID` INT(10) NULL,
  `IND_AMOUNT` DOUBLE NULL,
  `TEMP_AMOUNT` DOUBLE NULL,
  `GROUP_AMOUNT` DOUBLE NULL,
  `UNITID` INT(10) NULL,
  `SU` TINYINT(1) NOT NULL,
  `M` TINYINT(1) NOT NULL,
  `T` TINYINT(1) NOT NULL,
  `W` TINYINT(1) NOT NULL,
  `R` TINYINT(1) NOT NULL,
  `F` TINYINT(1) NOT NULL,
  `S` TINYINT(1) NOT NULL,
  `SORT` INT(10) NULL,
  `TOTE` INT(10) NULL,
  `LINENOTES` VARCHAR(255) NULL,
  `FRQ_WEEKS` INT(10) NULL,
  `FRQ_ROTATION` INT(10) NULL,
  INDEX `UNITID` (`UNITID` ASC),
  PRIMARY KEY (`ID`),
  CONSTRAINT `FOOD_TABLEDIET_SUB_TABLE`
    FOREIGN KEY (`FOODID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_TABLE` (`FOODID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `DIET TABLEDIET SUB TABLE`
    FOREIGN KEY (`DIETID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `UNIT TABLEDIET SUB TABLE`
    FOREIGN KEY (`UNITID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`UNITID` (`UNIT_TABLE`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DATA_SRC
-- ----------------------------------------------------------------------------
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
  PRIMARY KEY (`DataSrc_ID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.WEEKDAYS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`WEEKDAYS` (
  `WeekdayID` INT(10) NOT NULL,
  `SameDayTxt` VARCHAR(255) NULL,
  `NextDayTxt` VARCHAR(255) NULL,
  INDEX `DayNum` (`SameDayTxt` ASC),
  INDEX `WeekdayID` (`WeekdayID` ASC),
  PRIMARY KEY (`WeekdayID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.TODAY_DIET_SUB
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`TODAY_DIET_SUB` (
  `DIETID` INT(10) NOT NULL,
  `FEEDING` INT(10) NULL,
  `FOODID` INT(10) NULL,
  `GROUP_AMOUNT` DOUBLE NULL,
  `UNITID` INT(10) NULL,
  `SORT` INT(10) NULL,
  `TOTE` INT(10) NULL,
  `FOOD` VARCHAR(50) NULL,
  `UNIT` VARCHAR(50) NULL,
  `LINENOTES` VARCHAR(255) NULL,
  `MEAT` INT(10) NULL,
  `TABLEID` INT(10) NULL,
  `TARGETTABLE` INT(10) NULL,
  `DC_SORTORDER` INT(10) NULL,
  INDEX `UNITID` (`UNITID` ASC),
  INDEX `TABLEID` (`TABLEID` ASC),
  INDEX `FOODID` (`FOODID` ASC),
  INDEX `DIETID` (`DIETID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.PASTE_ERRORS
-- ----------------------------------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`PASTE_ERRORS` (
--   `Field0` LONGTEXT NULL,
--   `Field1` LONGTEXT NULL);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DIET_CHANGES
-- ----------------------------------------------------------------------------
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
	ON UPDATE CASCADE);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.LOCATION_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LOCATION_TABLE` (
  `LOCATIONID` INT(10) NOT NULL,
  `LOCATION` VARCHAR(50) NULL,
  `Color` VARCHAR(255) NULL,
  `ShortLocation` VARCHAR(255) NULL,
  INDEX `LOCATIONID` (`LOCATIONID` ASC),
  PRIMARY KEY (`LOCATIONID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.UNIT_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`UNIT_TABLE` (
  `UNITID` INT(10) NOT NULL,
  `UNIT` VARCHAR(50) NULL,
  `UnitType` VARCHAR(255) NULL,
  `ConversionToG` DOUBLE NULL,
  PRIMARY KEY (`UNITID`),
  INDEX `UNITID` (`UNITID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.NUT_DATA2
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`NUT_DATA2` (
  `Data_ID` INT(10) NOT NULL,
  `FOODID` INT(10) NULL,
  `Nutr_No` VARCHAR(255) NULL,
  `Nutr_Val` DOUBLE NULL,
  `Num_Data_Pts` VARCHAR(255) NULL,
  `Std_Error` VARCHAR(255) NULL,
  `Src_Cd` VARCHAR(2) NULL,
  `Deriv_Cd` VARCHAR(255) NULL,
  `Ref_NDB_No` VARCHAR(255) NULL,
  `Add_Nutr_Mark` VARCHAR(255) NULL,
  `Num_Studies` VARCHAR(255) NULL,
  `Min` VARCHAR(255) NULL,
  `Max` VARCHAR(255) NULL,
  `DF` VARCHAR(255) NULL,
  `Low_EB` VARCHAR(255) NULL,
  `Up_EB` VARCHAR(255) NULL,
  `Stat_Cmt` VARCHAR(255) NULL,
  `AddMod_Date` DATETIME NULL,
  `DataSrc_ID` INT(10) NULL,
  `DataSrc_Name` VARCHAR(255) NULL,
  INDEX `FOODID` (`FOODID` ASC),
  UNIQUE INDEX `Data_ID` (`Data_ID` ASC),
  INDEX `Num_Data_Pts` (`Num_Data_Pts` ASC),
  INDEX `Num_Studies` (`Num_Studies` ASC),
  CONSTRAINT `NUTR_DEFNUT_DATA2`
    FOREIGN KEY (`Nutr_No`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`NUTR_DEF` (`Nutr_No`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `DATA_SRCNUT_DATA2`
    FOREIGN KEY (`DataSrc_ID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DATA_SRC` (`DataSrc_ID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `SRC_CDNUT_DATA2`
    FOREIGN KEY (`Src_Cd`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SRC_CD` (`Src_Cd`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `FOOD_TABLENUT_DATA2`
    FOREIGN KEY (`FOODID`)
    REFERENCES  `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_TABLE` (`FOODID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.TODAY_DIET
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`TODAY_DIET_SUB` (
  `DIETID` INT(10) NOT NULL,
  `FEEDING` INT(10) NULL,
  `FOODID` INT(10) NULL,
  `GROUP_AMOUNT` DOUBLE NULL,
  `UNITID` INT(10) NULL,
  `SORT` INT(10) NULL,
  `TOTE` INT(10) NULL,
  `FOOD` VARCHAR(50) NULL,
  `UNIT` VARCHAR(50) NULL,
  `LINENOTES` VARCHAR(255) NULL,
  `MEAT` INT(10) NULL,
  `TABLEID` INT(10) NULL,
  `TARGETTABLE` INT(10) NULL,
  `DC_SORTORDER` INT(10) NULL,
  INDEX `UNITID` (`UNITID` ASC),
  INDEX `TABLEID` (`TABLEID` ASC),
  INDEX `FOODID` (`FOODID` ASC),
  INDEX `DIETID` (`DIETID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.LOGONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LOGONS` (
  `LoginID` INT(10) NOT NULL,
  `WindowsLogon` VARCHAR(255) NULL,
  `LogonDate` DATETIME NULL,
  `LogoffDate` DATETIME NULL,
  `DBType` VARCHAR(255) NULL,
  INDEX `WindowsLogon` (`WindowsLogon` ASC),
  PRIMARY KEY (`LoginID`),
  INDEX `LoginID` (`LoginID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.EMPLOYEE_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`EMPLOYEE_TABLE` (
  `EMPLOYEEID` INT(10) NOT NULL,
  `EMPLOYEE` VARCHAR(50) NULL,
  `UserLogin` VARCHAR(255) NULL,
  `INITIALS` VARCHAR(255) NULL,
  `LOCATIONID` INT(10) NULL,
  INDEX `LOCATIONID1` (`LOCATIONID` ASC),
  UNIQUE INDEX `BGTUserID` (`UserLogin` ASC),
  PRIMARY KEY (`EMPLOYEEID`),
  INDEX `EMPLOYEEID` (`EMPLOYEEID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.LIFE_STAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LIFE_STAGES` (
  `LifeStageID` INT(10) NOT NULL,
  `LifeStageCode` VARCHAR(255) NULL,
  `LifeStageName` VARCHAR(255) NULL,
  PRIMARY KEY (`LifeStageID`),
  INDEX `LifeStageCode` (`LifeStageCode` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DELIVERY_CONTAINER_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DELIVERY_CONTAINER_TABLE` (
  `DCID` INT(10) NOT NULL,
  `DC` VARCHAR(50) NULL,
  `LocationID` INT(10) NULL,
  `Exhibit` VARCHAR(255) NULL,
  `SortOrder` INT(10) NULL,
  `DCCODE` VARCHAR(255) NULL,
  `ARTEMIS_AREA` VARCHAR(255) NULL,
  `ARTEMIS_ENCLOSURE` VARCHAR(255) NULL,
  `ARTEMIS_SUBENCLOSURE` VARCHAR(255) NULL,
  INDEX `DCCODE` (`DCCODE` ASC),
  PRIMARY KEY (`DCID`),
  CONSTRAINT `LOCATION_TABLEDELIVERY_CONTAINER_TABLE`
    FOREIGN KEY (`LocationID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`LOCATION_TABLE` (`LOCATIONID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.SUBENCLOSURE_TABLE
-- ----------------------------------------------------------------------------
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
    ON UPDATE CASCADE);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.FOOD_PREP_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_PREP_TABLE` (
  `TABLEID` INT(10) NOT NULL,
  `DESCRIPTION` VARCHAR(50) NULL,
  `TABLECODE` VARCHAR(255) NULL,
  INDEX `TABLECODE` (`TABLECODE` ASC),
  INDEX `TABLEID` (`TABLEID` ASC),
  PRIMARY KEY (`TABLEID`));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.TOMORROW_DIET
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`TOMORROW_DIET` (
  `DIETID` INT(10) NULL,
  `SPECIESID` INT(10) NULL,
  `SPECIES` VARCHAR(255) NULL,
  `CURRENT` TINYINT(1) NOT NULL,
  `LABEL` TINYINT(1) NOT NULL,
  `NCPREPARES` TINYINT(1) NOT NULL,
  `NOTEID` VARCHAR(28) NULL,
  `DCID` INT(10) NULL,
  `DC` VARCHAR(50) NULL,
  `LOCATION` VARCHAR(50) NULL,
  `TABLEID` INT(10) NULL,
  `SortOrder` INT(10) NULL,
  `GroupID` INT(10) NULL,
  `DataDate` DATETIME NULL,
  `IMAGELINK` VARCHAR(255) NULL,
  INDEX `DIETID` (`DIETID` ASC),
  INDEX `DCID` (`DCID` ASC),
  INDEX `GroupID` (`GroupID` ASC),
  INDEX `TABLEID` (`TABLEID` ASC),
  INDEX `SPECIESID` (`SPECIESID` ASC),
  INDEX `NOTEID` (`NOTEID` ASC));

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.PREP_NOTE_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`PREP_NOTE_TABLE` (
  `PrepNoteID` INT(10) NOT NULL,
  `PrepNote` VARCHAR(255) NULL,
  `DietID` INT(10) NULL,
  INDEX `PrepNoteID` (`PrepNoteID` ASC),
  PRIMARY KEY (`PrepNoteID`),
  CONSTRAINT `DIET TABLEPREP NOTE TABLE`
    FOREIGN KEY (`DietID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (`DIETID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

-- ----------------------------------------------------------------------------
-- Table AnimalDietDatabase_OHDZA_be_ufe_combined.DIET_TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DIET_TABLE` (
  `DIETID` INT(10) NOT NULL,
  `SPECIESID` INT(10) NULL,
  `CURRENT` TINYINT(1) NOT NULL,
  `UserLogin` VARCHAR(255) NULL,
  `TABLEID` INT(10) NULL,
  `DATE` DATETIME NULL,
  `PARKID` INT(10) NULL,
  `NOTEID` VARCHAR(28) NULL,
  `LABEL` TINYINT(1) NOT NULL,
  `DCID` INT(10) NULL,
  `NCPREPARES` TINYINT(1) NOT NULL,
  `GroupID` INT(10) NULL,
  `Analyzed` TINYINT(1) NOT NULL,
  `DateAnalyzed` DATETIME NULL,
  `NEWDIETID` VARCHAR(255) NULL,
  `NUM_ANIMALS` INT(10) NULL,
  INDEX `DIETID` (`DIETID` ASC),
  INDEX `NUM_ANIMALS` (`NUM_ANIMALS` ASC),
  INDEX `CURRENT` (`CURRENT` ASC),
  INDEX `NOTEID` (`NOTEID` ASC),
  INDEX `NEWDIETID` (`NEWDIETID` ASC),
  PRIMARY KEY (`DIETID`),
  INDEX `PARKID` (`PARKID` ASC),
  CONSTRAINT `SUBENCLOSURE_TABLEDIET_TABLE`
    FOREIGN KEY (`GroupID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SUBENCLOSURE_TABLE` (`SE_ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `SPECIES TABLEDIET TABLE`
    FOREIGN KEY (`SPECIESID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`SPECIES_TABLE` (`SPECIESID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `DELIVERY CONTAINER TABLEDIET TABLE`
    FOREIGN KEY (`DCID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`DELIVERY_CONTAINER_TABLE` (`DCID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `EMPLOYEE TABLEDIET TABLE`
    FOREIGN KEY (`UserLogin`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`EMPLOYEE_TABLE` (`UserLogin`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `FOOD PREP TABLEDIET TABLE`
    FOREIGN KEY (`TABLEID`)
    REFERENCES `AnimalDietDatabase_OHDZA_be_ufe_combined`.`FOOD_PREP_TABLE` (`TABLEID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);
SET FOREIGN_KEY_CHECKS = 1;
