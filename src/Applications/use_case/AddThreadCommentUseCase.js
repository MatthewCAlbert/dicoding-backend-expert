const NewThreadComment = require('../../Domains/threads/entities/NewThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThreadComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.checkOneById(newThreadComment.thread);
    return this._threadRepository.addOneComment(newThreadComment);
  }
}

module.exports = AddThreadCommentUseCase;
