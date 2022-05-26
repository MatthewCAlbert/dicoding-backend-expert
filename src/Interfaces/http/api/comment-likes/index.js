const routes = require('./routes');
const CommentLikeHandler = require('./handler');

module.exports = {
  name: 'comment-likes',
  register: async (server, { container }) => {
    const commentsHandler = new CommentLikeHandler(container);
    server.route(routes(commentsHandler));
  },
};
