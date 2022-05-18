const routes = (threadsHandler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: threadsHandler.addOne,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: threadsHandler.getOne,
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: threadsHandler.addOneComment,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: threadsHandler.deleteOneComment,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: threadsHandler.addOneCommentReply,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: threadsHandler.deleteOneCommentReply,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
