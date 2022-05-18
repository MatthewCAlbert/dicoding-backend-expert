const routes = (authenticationsHandler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: authenticationsHandler.addOne,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authenticationsHandler.updateOne,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authenticationsHandler.deleteOne,
  },
]);

module.exports = routes;
