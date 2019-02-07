const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const loginFunc = (Account, Role) => (req, res) => {
  Account.login({
    email: req.body.email,
    password: req.body.password,
    ttl: 60 * 60 * 24 * 7 * 2, // two weeks
  }, (err, accessToken) => {
    if (err) {
      res.status(401).json({ message: 'Unauthorized', status: 401 });
    } else {
      Role.getRoles({
        principleType: 'account',
        principleId: accessToken.userId,
      }, (err2, roles) => {
        if (err2) {
          res.status(401).json({ message: 'Unable to get roles', status: 401 });
        } else {
          res.json({
            userId: accessToken.userId,
            id: accessToken.id,
            roles,
          });
        }
      });
    }
  });
};

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', server.loopback.status());
  const { Account, Role } = server.models;
  router.post('/login', jsonParser, loginFunc(Account, Role));
  server.use(router);
};
