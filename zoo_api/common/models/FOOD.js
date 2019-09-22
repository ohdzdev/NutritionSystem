const moment = require('moment');

const app = require('../../server/server');
const Util = require('../../server/util');

module.exports = function(Food) {
  Food.getDayPrepSheets = function(date, cb) {
    const nextDate = moment(date, 'YYYY-MM-DD').add(1, 'days');
    app.datasources.zoo_mysql.connector.execute('CALL zoo.GetDayPrepSheets(?)', [nextDate.format('YYYY-M-D')], (err, [rows]) => {
      if (err) {
        cb(Util.createError('Error processing request', 500));
      } else {
        cb(null, rows);
      }
    });
  };

  Food.remoteMethod(
    'getDayPrepSheets',
    {
      description: 'Gets the data for the prep sheets for a given day.',
      accepts: [
        {
          arg: 'date',
          type: 'string',
          required: true,
          http: { source: 'query' },
          description: 'The date to make the prep sheet data for in YYYY-MM-DD format.',
        },
      ],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'get', path: '/day-prep-sheet-data' },
    }
  );

  Food.getFoodCostReport = function(cb) {
    app.datasources.zoo_mysql.connector.execute('CALL zoo.GetFoodCostReport()', (err, [rows]) => {
      if (err) {
        cb(Util.createError('Error processing request', 500));
      } else {
        cb(null, rows);
      }
    });
  };

  Food.remoteMethod(
    'getFoodCostReport', {
      description: 'Gets the data for a food cost report',
      accepts: [],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'get', path: '/food-cost-report' },
    }
  );

  Food.getFoodCostReportByGL = function(cb) {
    app.datasources.zoo_mysql.connector.execute('CALL zoo.GetFoodCostReportByGL()', (err, [rows]) => {
      if (err) {
        cb(Util.createError('Error processing request', 500));
      } else {
        const rowsWithMonthAndYearValues = rows.map((row) => ({
          ...row,
          SumOfCostGPerMonth: parseFloat((row.SumOfCostGPerDay * 365 / 12).toFixed(2)),
          SumOfCostGPerYear: parseFloat((row.SumOfCostGPerDay * 365).toFixed(2)),
        }))
        cb(null, rowsWithMonthAndYearValues);
      }
    });
  };

  Food.remoteMethod(
    'getFoodCostReportByGL', {
      description: 'Gets the data for a food cost report by budget code',
      accepts: [],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'get', path: '/food-cost-report-by-gl' },
    }
  );

};
