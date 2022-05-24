const routes = (usersHandler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: usersHandler.addUser,
  },
]);

module.exports = routes;
