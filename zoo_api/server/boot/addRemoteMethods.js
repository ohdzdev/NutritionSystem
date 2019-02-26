const Util = require('../util');

module.exports = function enableAuthentication(server) {
  const { AccessToken } = server.models;

  AccessToken.validate = function(data, cb) {
    // Clear old AccessTokens on a user login, inexpesive and doesn't require a trigger-like function to be ran all the time
    // AccessToken.destroyAll({
    //  created: { lt: Date.now() - 60 * 60 * 24 * 7 * 2 * 1000 },
    // }, () => {
    AccessToken.resolve.call(this, data.token, (err, res) => {
      if (err) {
        cb(err);
        return;
      }

      if (res) {
        cb();
      } else {
        cb(Util.createError('Unauthorized', 401));
      }
    });
    // });
  };

  AccessToken.remoteMethod(
    'validate',
    {
      http: { verb: 'post' },
      accepts: [
        {
          arg: 'data',
          type: 'object',
          required: true,
          http: { source: 'body' },
        },
      ],
    },
  );
};
