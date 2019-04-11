
/**
 * STEPS TO UPDATE LOOPBACK MODEL SCHEMA
 * 1. in cmd set node environment to 'production'
 *
 * 2. change 'MODELNAME' to whatever table you want updated into loopback
 *
 * 3. save the file and run it via node 'node ./discover-models.js' if current dir is the same
 */

const loopback = require('loopback');
const { promisify } = require('util');
const fs = require('fs');

require('dotenv').config();

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));

const DATASOURCE_NAME = 'zoo_mysql';
const dataSourceConfig = require('./server/datasources.production');

const MODELNAME = 'DIETS'; // CHANGE ME WHEN UPDATING MODEL SCHEMA

const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);
async function discover() {
  // It's important to pass the same "options" object to all calls
  // of dataSource.discoverSchemas(), it allows the method to cache
  // discovered related models
  const options = { relations: true };

  // Discover models and relations
  const result = await db.discoverSchemas(MODELNAME, options);

  // Create model definition files
  await mkdirp('common/models');
  console.log(result);
  await writeFile(
    `common/models/${MODELNAME}.json`,
    JSON.stringify(result[`zoo.${MODELNAME}`], null, 2)
  );

  // Expose models via REST API
  const configJson = await readFile('server/model-config.json', 'utf-8');
  console.log('MODEL CONFIG', configJson);
  const config = JSON.parse(configJson);
  config[MODELNAME] = { dataSource: DATASOURCE_NAME, public: true };
  await writeFile(
    'server/model-config.json',
    JSON.stringify(config, null, 2)
  );
}

discover().then(
  success => process.exit(), // eslint-disable-line no-unused-vars
  error => { console.error('UNHANDLED ERROR:\n', error); process.exit(1); },
);
