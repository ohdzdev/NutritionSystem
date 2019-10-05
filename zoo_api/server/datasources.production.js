// require('dotenv').config();
module.exports = {
  // eslint-disable-next-line camelcase
  zoo_mysql: {
    host: process.env.DB_HOST,
    port: 3306,
    socketPath:
      process.env.NODE_ENV === 'production'
        ? `/cloudsql/${process.env.SQL_INSTANCE_CONNECTION_NAME}`
        : undefined,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    name: 'zoo_mysql',
    connector: 'mysql',
    user: process.env.DB_USER,
    all: true,
  },
};
