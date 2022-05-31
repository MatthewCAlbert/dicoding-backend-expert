const ThreadCommentReplyUseCases = require('../../../../Applications/use_case/ThreadCommentReplyUseCases');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addCommentReply = this.addCommentReply.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }

  async addCommentReply(request, h) {
    const { commentId, threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const threadCommentReplyUseCases = this._container
      .getInstance(ThreadCommentReplyUseCases.name);
    const addedReply = await threadCommentReplyUseCases.addCommentReply({
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

    const threadCommentReplyUseCases = this._container
      .getInstance(ThreadCommentReplyUseCases.name);
    await threadCommentReplyUseCases.deleteCommentReply({
      id: replyId, userId: credentialId, threadId, commentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
