const ThreadCommentLikeUseCases = require('../../../../Applications/use_case/ThreadCommentLikeUseCases');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.addCommentLike = this.addCommentLike.bind(this);
  }

  async addCommentLike(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentLikeUseCases = this._container.getInstance(ThreadCommentLikeUseCases.name);
    await threadCommentLikeUseCases.toggleThreadCommentLike({
      id: commentId, userId: credentialId, threadId,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentLikeHandler;
