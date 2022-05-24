const routes = (threadsHandler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: threadsHandler.addThread,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: threadsHandler.getThreadDetail,
  },
]);

module.exports = routes;
