const Util = require('../../server/util');
const app = require('../../server/server');

module.exports = function(DietChanges) {
  DietChanges.getLastDietChanges = function(n, cb) {
    app.datasources.zoo_mysql.connector.execute('CALL zoo.GetLastDietChanges(?)', [n], (err, [dietChanges]) => {
      if (err) {
        cb(Util.createError('Error processing request', 500));
      } else {
        cb(null, {
          dietChanges,
        });
      }
    });
  };

  DietChanges.remoteMethod('getLastDietChanges', {
    description: 'Gets the last n diet changes for each diet',
    accepts: [
      {
        arg: 'changes',
        type: 'number',
        required: true,
        http: { source: 'query' },
        description: 'The number of diet changes.',
      },
    ],
    returns: {
      arg: 'data', type: 'object', root: true,
    },
    http: { verb: 'get', path: '/last-diet-changes' },
  });

  DietChanges.deleteAllByDietId = function(body, cb) {
    const { dietId } = body;
    if (dietId) {
      if (Number.isNaN(parseInt(dietId, 10))) {
        cb(Util.createError('Please send in a valid dietId', 400));
        return;
      }
      const checkedDietId = parseInt(dietId, 10);

      DietChanges.destroyAll({ dietId: checkedDietId }, (err, info) => {
        if (err) {
          cb(Util.createError(`Error when deleting records related to (${checkedDietId}): ${err}`, 500));
        } else {
          cb(null, { data: info });
        }
      });
    } else {
      cb(Util.createError('dietId missing from body of request', 400));
    }
  };
  DietChanges.remoteMethod(
    'deleteAllByDietId',
    {
      description: 'Delete records that match filter',
      accepts: [
        {
          arg: 'dietId', type: 'any', required: true, http: { source: 'body' },
        },
      ],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'post', path: '/deleteAllByDietId' },
    }
  );
};
