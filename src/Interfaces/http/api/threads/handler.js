const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const AddThreadCommentReplyUseCase = require('../../../../Applications/use_case/AddThreadCommentReplyUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const DeleteThreadCommentReplyUseCase = require('../../../../Applications/use_case/DeleteThreadCommentReplyUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addOne = this.addOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.addOneComment = this.addOneComment.bind(this);
    this.deleteOneComment = this.deleteOneComment.bind(this);
    this.addOneCommentReply = this.addOneCommentReply.bind(this);
    this.deleteOneCommentReply = this.deleteOneCommentReply.bind(this);
  }

  async addOne(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      ...request.payload, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: addedThread.owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getOne(request) {
    const { id } = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute({ id });
    delete thread.owner;

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async addOneComment(request, h) {
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

  async deleteOneComment(request) {
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

  async addOneCommentReply(request, h) {
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

  async deleteOneCommentReply(request) {
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

module.exports = ThreadHandler;
