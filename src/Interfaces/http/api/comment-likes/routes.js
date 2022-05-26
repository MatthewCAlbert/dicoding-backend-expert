const routes = (commentLikesHandler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: commentLikesHandler.addCommentLike,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;
