const ToggleThreadCommentLikeUseCase = require('../../../../Applications/use_case/comment-likes/ToggleThreadCommentLikeUseCase');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.addCommentLike = this.addCommentLike.bind(this);
  }

  async addCommentLike(request, h) {
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const toggleThreadCommentLikeUseCase = this._container
      .getInstance(ToggleThreadCommentLikeUseCase.name);
    await toggleThreadCommentLikeUseCase.execute({
      id: commentId, userId: credentialId, threadId,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentLikeHandler;
