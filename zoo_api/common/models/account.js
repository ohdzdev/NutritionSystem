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
        cb(null, {
          token: accessToken.id,
        });
      }
    });
  };
};
