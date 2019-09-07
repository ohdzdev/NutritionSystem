const tmp = require('tmp');

tmp.setGracefulCleanup();

module.exports = function(/* server */) {
  // // Install a `/` route that returns server status
  // const router = server.loopback.Router();
  // // Custom routes
  // router.get(/^\/((?!api).)*(\/.*)?$/, server.loopback.status());
  // server.use(router);
};
