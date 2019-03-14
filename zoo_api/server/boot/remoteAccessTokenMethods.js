const Util = require('../util');

module.exports = function remoteAccessTokenMethods(server) {
  const { AccessToken } = server.models;

  AccessToken.validate = function(data, cb) {
    AccessToken.resolve.call(this, data.token, (err, res) => {
      if (err) {
        cb(err);
      } else if (res) {
        cb();
      } else {
        cb(Util.createError('Unauthorized', 401));
      }
    });
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

  AccessToken.disableRemoteMethodByName('count');
  AccessToken.disableRemoteMethodByName('create');
  AccessToken.disableRemoteMethodByName('createChangeStream');
  AccessToken.disableRemoteMethodByName('deleteById');
  AccessToken.disableRemoteMethodByName('exists');
  AccessToken.disableRemoteMethodByName('find');
  AccessToken.disableRemoteMethodByName('findById');
  AccessToken.disableRemoteMethodByName('findOne');
  AccessToken.disableRemoteMethodByName('prototype.__get__user');
  AccessToken.disableRemoteMethodByName('prototype.updateAttributes');
  AccessToken.disableRemoteMethodByName('replaceById');
  AccessToken.disableRemoteMethodByName('replaceOrCreate');
  AccessToken.disableRemoteMethodByName('updateAll');
  AccessToken.disableRemoteMethodByName('upsert');
  AccessToken.disableRemoteMethodByName('upsert');
  AccessToken.disableRemoteMethodByName('upsertWithWhere');
};
