const Util = require('../../server/util');

module.exports = function(PrepNotes) {
  PrepNotes.deleteAllByDietId = function(body, cb) {
    const { dietId } = body;
    if (dietId) {
      if (Number.isNaN(parseInt(dietId, 10))) {
        cb(Util.createError('Please send in a valid dietId', 400));
        return;
      }
      const checkedDietId = parseInt(dietId, 10);

      PrepNotes.destroyAll({ dietId: checkedDietId }, (err, info) => {
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
  PrepNotes.remoteMethod(
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
