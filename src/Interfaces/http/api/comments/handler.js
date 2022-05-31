const ThreadCommentUseCases = require('../../../../Applications/use_case/ThreadCommentUseCases');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async addComment(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentUseCases = this._container.getInstance(ThreadCommentUseCases.name);
    const addedComment = await threadCommentUseCases.addThreadComment({
      ...request.payload, owner: credentialId, thread: threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id: addedComment.id,
          content: addedComment.content,
          owner: addedComment.owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async deleteComment(request) {
    const { commentId, threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentUseCases = this._container.getInstance(ThreadCommentUseCases.name);
    await threadCommentUseCases.deleteThreadComment({
      id: commentId, userId: credentialId, threadId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
