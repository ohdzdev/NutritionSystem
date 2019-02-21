const Util = require('../util');

module.exports = function enableAuthentication(server) {
  const {
    AccessToken, Account, Role, RoleMapping,
  } = server.models;

  AccessToken.validateAndRetreiveUser = function(data, cb) {
    // Clear old AccessTokens on a user login, inexpesive and doesn't require a trigger-like function to be ran all the time
    AccessToken.destroyAll({
      created: { lt: Date.now() - 60 * 60 * 24 * 7 * 2 * 1000 },
    }, (error, result) => {
      if (error) {
        cb(result);
        return;
      }
      // DEBUG for list of items deleted
      // console.log(`old tokens removed: ${JSON.stringify(result)}`);

      AccessToken.resolve.call(this, data.token, (err, res) => {
        if (err) {
          cb(err);
          return;
        }

        if (res) {
          Account.findById(res.userId, (err2, account) => {
            if (err2) {
              cb(err2);
              return;
            }

            const accountData = account.__data; // eslint-disable-line no-underscore-dangle

            Role.getRoles({
              principalType: RoleMapping.USER,
              principalId: accountData.id,
            }, (err3, roles) => {
              if (err3) {
                cb(Util.createError('Error getting roles', 401));
              } else {
                const roleId = roles.find((a) => a > 0);
                if (!roleId) {
                  cb(Util.createError('Role not found', 401));
                } else {
                  Role.findById(roleId, (err4, role) => {
                    if (err4) {
                      cb(Util.createError('Role not found', 401));
                    } else {
                      cb(null, {
                        firstName: accountData.firstName,
                        lastName: accountData.lastName,
                        email: accountData.email,
                        id: accountData.id,
                        role: role.name,
                      });
                    }
                  });
                }
              }
            });
          });
        } else {
          cb(Util.createError('Unauthorized', 401));
        }
      });
    });
  };

  AccessToken.remoteMethod(
    'validateAndRetreiveUser',
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
