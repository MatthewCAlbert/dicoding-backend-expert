const routes = (repliesHandler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: repliesHandler.addCommentReply,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: repliesHandler.deleteCommentReply,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
