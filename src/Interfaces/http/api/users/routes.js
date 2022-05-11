const { routeHandlerMapper } = require('../../api/ApiHandler');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
].map(routeHandlerMapper));

module.exports = routes;
