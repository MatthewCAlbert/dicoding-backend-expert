const NewThreadCommentReply = require('../../Domains/threads/entities/NewThreadCommentReply');

class AddThreadCommentReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThreadCommentReply = new NewThreadCommentReply(useCasePayload);
    await this._threadRepository.checkOneCommentById(newThreadCommentReply.comment);
    await this._threadRepository.checkOneById(newThreadCommentReply.thread);
    return this._threadRepository.addOneCommentReply(newThreadCommentReply);
  }
}

module.exports = AddThreadCommentReplyUseCase;
