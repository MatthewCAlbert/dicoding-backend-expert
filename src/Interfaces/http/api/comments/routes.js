const routes = (commentsHandler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: commentsHandler.addComment,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: commentsHandler.deleteComment,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
