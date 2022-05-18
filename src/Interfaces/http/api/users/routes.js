const routes = (usersHandler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: usersHandler.addOne,
  },
]);

module.exports = routes;
