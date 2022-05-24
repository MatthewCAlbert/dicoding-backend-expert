const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase');
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/use_case/DeleteThreadCommentReplyUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addCommentReply = this.addCommentReply.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }

  async addCommentReply(request, h) {
    const { commentId, threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addThreadCommentReplyUseCase = this._container
      .getInstance(AddThreadCommentReplyUseCase.name);
    const addedReply = await addThreadCommentReplyUseCase.execute({
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

    const deleteThreadCommentReplyUseCase = this._container
      .getInstance(DeleteThreadCommentReplyUseCase.name);
    await deleteThreadCommentReplyUseCase.execute({
      id: replyId, userId: credentialId, threadId, commentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
