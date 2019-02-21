// in case the mysql database is gone, after running the schema this will need to be ran
// in order to create the tables from loopback

// usage: node ./automigrate.js

const server = require('./server');

const ds = server.dataSources.zoo_mysql;
const lbTables = ['account', 'ACL', 'RoleMapping', 'Role', 'AccessToken'];
ds.automigrate(lbTables, (er) => {
  if (er) throw er;
  console.log(`Loopback tables [${
    lbTables}] created in `, ds.adapter.name);
  ds.disconnect();
});
