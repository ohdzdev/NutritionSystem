const tmp = require('tmp');
const { spawnSync } = require('child_process');
const moment = require('moment');
const app = require('../../server/server');

const Util = require('../../server/util');

const host =
  process.env.NODE_ENV === 'production'
    ? `/cloudsql/${process.env.SQL_INSTANCE_CONNECTION_NAME}`
    : `${process.env.DB_HOST};port=3306`;

const dbString = `host=${host};user=${process.env.DB_USER};password=${process.env.DB_PASS};database=${process.env.DB_NAME};protocol=unix`;

module.exports = function(Diets) {
  Diets.getDayDiets = function(date, cb) {
    const day = moment(date, 'YYYY-MM-DD');
    app.datasources.zoo_mysql.connector.execute(
      'CALL zoo.GetDayDiet(?)',
      [day.format('YYYY-M-D')],
      (err, [diets]) => {
        if (err) {
          cb(Util.createError('Error processing request', 500));
        } else {
          app.datasources.zoo_mysql.connector.execute(
            'CALL zoo.GetDayDietSub(?)',
            [day.format('YYYY-M-D')],
            (err2, [dietsSub]) => {
              if (err2) {
                cb(Util.createError('Error processing request', 500));
              } else {
                cb(null, {
                  diets,
                  dietsSub,
                });
              }
            },
          );
        }
      },
    );
  };

  Diets.exportDietAnalysis = (dietId, res, cb) => {
    Diets.findById(dietId, (err, diet) => {
      if (err || !diet) {
        cb(Util.createError('Diet not found'));
      } else {
        // make a temporary file for the workbook
        tmp.file({ postfix: '.xlsm' }, (err3, tmpWorkbook) => {
          if (err3) {
            cb(Util.createError('Error making shared temp file'));
          } else {
            const processResult = spawnSync(
              './ExcelApp',
              [`${diet.dietId}`, tmpWorkbook, dbString],
              {
                cwd: './zoo_api/lib/DietAnalysisExport/bin',
              },
            );
            if (!processResult || processResult.status !== 0) {
              cb(Util.createError('Error running export process'));
            } else {
              res.download(tmpWorkbook, 'DietDataAnalysis.xlsm');
            }
          }
        });
      }
    });
  };

  Diets.remoteMethod('exportDietAnalysis', {
    description: 'Export a diet analysis spreadsheet',
    accepts: [
      { arg: 'id', type: 'any', required: true },
      {
        arg: 'res',
        type: 'object',
        http: { source: 'res' },
      },
    ],
    returns: {
      arg: 'data',
      type: 'file',
      root: true,
    },
    http: { verb: 'get', path: '/:id/export-diet-analysis' },
  });

  Diets.remoteMethod('getDayDiets', {
    description: 'Gets the data for the diets for a given day.',
    accepts: [
      {
        arg: 'date',
        type: 'string',
        required: true,
        http: { source: 'query' },
        description: 'The date to make the diet data for in YYYY-MM-DD format.',
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
    http: { verb: 'get', path: '/day-diets' },
  });
};
