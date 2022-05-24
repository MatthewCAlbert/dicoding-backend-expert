const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async addComment(request, h) {
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedComment = await addThreadCommentUseCase.execute({
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

    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await deleteThreadCommentUseCase.execute({
      id: commentId, userId: credentialId, threadId,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
