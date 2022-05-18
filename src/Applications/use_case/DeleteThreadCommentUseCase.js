const GetOneById = require('../../Domains/threads/entities/GetOneById');

class DeleteThreadCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id: threadCommentId, userId, threadId } = new GetOneById(useCasePayload);
    await this._threadRepository.checkOneCommentById(threadCommentId);
    await this._threadRepository.checkOneById(threadId);
    await this._threadRepository.checkCommentOwnership(threadCommentId, userId);
    return this._threadRepository.deleteOneComment(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
