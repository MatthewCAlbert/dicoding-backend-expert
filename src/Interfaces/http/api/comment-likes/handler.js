const ThreadCommentLikeUseCase = require('../../../../Applications/use_case/ThreadCommentLikeUseCase');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.addCommentLike = this.addCommentLike.bind(this);
  }

  async addCommentLike(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentLikeUseCase = this._container.getInstance(ThreadCommentLikeUseCase.name);
    await threadCommentLikeUseCase.toggleThreadCommentLike({
      id: commentId, userId: credentialId, threadId,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentLikeHandler;
