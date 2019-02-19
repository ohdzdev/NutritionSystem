module.exports = function(server) {
  const { AccessToken } = server.models;

  // Clear old AccessTokens
  AccessToken.destroyAll({
    created: { lt: Date.now() - 60 * 60 * 24 * 7 * 2 * 1000 },
  });
};
