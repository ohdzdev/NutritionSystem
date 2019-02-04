'use strict';

module.exports = {
  'zoo_mysql': {
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB,
    password: process.env.DB_PASS,
    name: 'zoo_mysql',
    connector: 'mysql',
    user: process.env.DB_USER,
    all: true,
  },
};
