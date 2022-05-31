const AddCommentReplyUseCase = require('../../../../Applications/use_case/replies/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/replies/DeleteCommentReplyUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addCommentReply = this.addCommentReply.bind(this);
    this.deleteCommentReply = this.deleteCommentReply.bind(this);
  }

  async addCommentReply(request, h) {
    const { commentId, threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addCommentReplyUseCase = this._container
      .getInstance(AddCommentReplyUseCase.name);
    const addedReply = await addCommentReplyUseCase.execute({
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

    const deleteCommentReplyUseCase = this._container
      .getInstance(DeleteCommentReplyUseCase.name);
    await deleteCommentReplyUseCase.execute({
      id: replyId, userId: credentialId, threadId, commentId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
