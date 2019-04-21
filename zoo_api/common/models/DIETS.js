const moment = require('moment');

const Util = require('../../server/util');
const app = require('../../server/server');

module.exports = function(Diets) {
  Diets.getDayDiets = function(date, cb) {
    const day = moment(date, 'YYYY-MM-DD');
    app.datasources.zoo_mysql.connector.execute('CALL zoo.GetDayDiet(?)', [day.format('YYYY-M-D')], (err, [diets]) => {
      if (err) {
        cb(Util.createError('Error processing request', 500));
      } else {
        app.datasources.zoo_mysql.connector.execute('CALL zoo.GetDayDietSub(?)', [day.format('YYYY-M-D')], (err2, [dietsSub]) => {
          if (err2) {
            cb(Util.createError('Error processing request', 500));
          } else {
            cb(null, {
              diets,
              dietsSub,
            });
          }
        });
      }
    });
  };

  Diets.remoteMethod(
    'getDayDiets',
    {
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
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'get', path: '/day-diets' },
    }
  );
};
