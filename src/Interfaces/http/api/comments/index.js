const routes = require('./routes');
const CommentHandler = require('./handler');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentHandler(container);
    server.route(routes(commentsHandler));
  },
};
