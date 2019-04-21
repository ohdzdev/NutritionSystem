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
};
