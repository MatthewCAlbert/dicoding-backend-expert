const GetOneById = require('../../Domains/threads/entities/GetOneById');

class DeleteThreadCommentReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const {
      id: threadCommentReplyId, userId, threadId, commentId,
    } = new GetOneById(useCasePayload);
    await this._threadRepository.checkOneCommentReplyById(threadCommentReplyId);
    await this._threadRepository.checkOneCommentById(commentId);
    await this._threadRepository.checkOneById(threadId);
    await this._threadRepository.checkCommentReplyOwnership(threadCommentReplyId, userId);
    return this._threadRepository.deleteOneCommentReply(threadCommentReplyId);
  }
}

module.exports = DeleteThreadCommentReplyUseCase;
