
module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

  // Base code to create a new user
  /*
  const { Account, Role, RoleMapping } = server.models;
  Account.create({
    email: 'kitchen@zoo.com',
    password: 'zookitchen',
    firstName: 'Gordon',
    lastName: 'Ramsay',
  }, (err, userInstance) => {
    if (err) throw err;

    Role.findOne({
      where: {
        name: 'kitchen',
      },
    }, (err2, adminRole) => {
      if (err2) throw err;

      adminRole.principals.create({
        principalType: RoleMapping.USER,
        principalId: userInstance.id,
      }, (err3, principle) => {
        if (err3) throw err;
        console.log(principle);
      });
    });
  });
  */
};
