const app = require('../../server/server');
const Util = require('../../server/util');

module.exports = function(Account) {
  const { login: originalLogin } = Account;

  Account.login = function(body, _, cb) {
    originalLogin.call(this, {
      email: body.email,
      password: body.password,
      ttl: 60 * 60 * 24 * 7 * 2, // two weeks
    }, 'user', (err, accessToken) => {
      if (err) {
        cb(Util.createError('Unauthorized', 401));
      } else {
        const { user } = accessToken.__data; // eslint-disable-line no-underscore-dangle
        app.models.Role.getRoles({
          principalType: app.models.RoleMapping.USER,
          principalId: accessToken.userId,
        }, (err2, roles) => {
          if (err2) {
            cb(Util.createError('Error getting roles', 401));
          } else {
            const roleId = roles.find((a) => a > 0);
            if (!roleId) {
              cb(Util.createError('Role not found', 401));
            } else {
              app.models.Role.findById(roleId, (err3, role) => {
                if (err3) {
                  cb(Util.createError('Role not found', 401));
                } else {
                  cb(null, {
                    token: accessToken.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: role.name,
                    id: accessToken.userId,
                  });
                }
              });
            }
          }
        });
      }
    });
  };

  Account.resetPasswordByAdmin = function(body, cb) {
    Account.findById(body.id, (err, account) => {
      if (err) {
        cb(Util.createError('Error finding account', 500));
      } else if (account) {
        account.setPassword(body.newPassword, (err2) => {
          if (err2) {
            cb(Util.createError('Error setting new password', 500));
          } else {
            cb(null, { updated: true });
          }
        });
      } else {
        cb(Util.createError('Error finding account', 500));
      }
    });
  };

  Account.remoteMethod(
    'resetPasswordByAdmin',
    {
      description: 'Reset a users password (admins only)',
      accepts: [
        {
          arg: 'resetInfo', type: 'object', required: true, http: { source: 'body' },
        },
      ],
      returns: {
        arg: 'data', type: 'object', root: true,
      },
      http: { verb: 'post', path: '/reset-password' },
    }
  );

  Account.disableRemoteMethodByName('setPassword');
  Account.disableRemoteMethodByName('resetPassword');
};
