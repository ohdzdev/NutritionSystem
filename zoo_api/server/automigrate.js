// in case the mysql database is gone, after running the schema this will need to be ran
// in order to create the tables from loopback

// usage: node ./automigrate.js

const server = require('./server');

const ds = server.dataSources.zoo_mysql;

const customTables = ['account', 'ACL', 'RoleMapping', 'Role', 'AccessToken'];

const zooTables = [
  'ANIMALS',
  'BUDGET_IDS',
  'CASE_NOTES',
  'DATA_SRC',
  'DELIVERY_CONTAINERS',
  'DIET_CHANGES',
  'DIET_HISTORY',
  'DIET_PLAN',
  'DIETS',
  'EMPLOYEES',
  'FOOD_CATEGORIES',
  'FOOD_PREP_TABLES',
  'FOOD_WEIGHTS',
  'FOOD',
  'LIFE_STAGES',
  'LOCATIONS',
  'NUT_DATA',
  'NUTR_DEF',
  'PARK_TABLE',
  'PREP_NOTES',
  'SPECIES',
  'SRC_CD',
  'SUBENCLOSURES',
  'UNITS',
  'weekdays',
];

ds.automigrate(customTables, (er) => {
  if (er) throw er;
  console.log(`Loopback tables [${
    customTables}] created in `, ds.adapter.name);
  ds.disconnect();
});

ds.automigrate(zooTables, (err2) => {
  if (err2) throw err2;
  console.log(`Loopback tables[${
    zooTables}] created in `, ds.adapter.name);
  ds.disconnect();
});
