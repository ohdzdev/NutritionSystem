
module.exports = function enableAuthentication(server) {
  const { AccessToken } = server.models;

  AccessToken.validateToken = function(data, cb) {
    console.log(data);
    AccessToken.resolve.call(this, data.token, (err, res) => {
      if (err) {
        cb(err);
        return;
      }

      console.log(res);
      cb(null, {
        ...res,
      });
    });
  };

  AccessToken.remoteMethod(
    'validateToken',
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
      returns: {
        arg: 'data',
        type: 'object',
      },
    },
  );
};
