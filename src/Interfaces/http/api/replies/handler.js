const ThreadCommentReplyUseCase = require('../../../../Applications/use_case/ThreadCommentReplyUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addCommentReply = this.addCommentReply.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }

  async addCommentReply(request, h) {
    const { commentId, threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentReplyUseCase = this._container
      .getInstance(ThreadCommentReplyUseCase.name);
    const addedReply = await threadCommentReplyUseCase.addCommentReply({
      ...request.payload, owner: credentialId, comment: commentId, thread: threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply: {
          id: addedReply.id,
          content: addedReply.content,
          owner: addedReply.owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReply(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentReplyUseCase = this._container
      .getInstance(ThreadCommentReplyUseCase.name);
    await threadCommentReplyUseCase.deleteCommentReply({
      id: replyId, userId: credentialId, threadId, commentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
