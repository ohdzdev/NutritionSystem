const Util = require('../../server/util');

module.exports = function(DietHistory) {
  DietHistory.deleteAllViaFilter = function(body, cb) {
    console.log(body);
    const { filter } = body;
    let filterJSON = {};
    if (filter) {
      try {
        filterJSON = JSON.parse(JSON.stringify(filter));
      } catch (error) {
        console.log(error);
        cb(Util.createError('Filter is not valid JSON.', 400));
        return;
      }

      if ('where' in filterJSON) {
        cb(Util.createError('where syntax is not valid in deleteAll. https://loopback.io/doc/en/lb3/Where-filter.html please follow this syntax for deleteAll', 400));
        return;
      }

      DietHistory.destroyAll(filterJSON, (err, info) => {
        if (err) {
          cb(Util.createError(`Error when deleting via filter: ${err}`, 500));
        } else {
          cb(null, { data: info });
        }
      });
    } else {
      cb(Util.createError('Filter missing from body of request', 400));
    }
  };
  DietHistory.remoteMethod(
    'deleteAllViaFilter',
    {
      description: 'Delete records that match filter',
      accepts: [
        {
          arg: 'filter', type: 'object', required: true, http: { source: 'body' },
        },
      ],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'post', path: '/deleteAllViaFilter' },
    }
  );
};
