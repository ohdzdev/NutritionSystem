// in case the mysql database is gone, after running the schema this will need to be ran
// in order to create the tables from loopback

// usage: node ./automigrate.js
'use strict';

var server = require('./server');
var ds = server.dataSources.zoo_mysql;
var lbTables = ['account', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' +
  lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
