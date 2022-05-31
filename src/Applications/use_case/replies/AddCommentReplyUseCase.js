const NewThreadCommentReply = require('../../../Domains/replies/entities/NewThreadCommentReply');

class AddCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const newThreadCommentReply = new NewThreadCommentReply(useCasePayload);
    await this._commentRepository.checkAvailibilityCommentById(newThreadCommentReply.comment);
    await this._threadRepository.checkAvailibilityThreadById(newThreadCommentReply.thread);
    return this._replyRepository.addCommentReply(newThreadCommentReply);
  }
}

module.exports = AddCommentReplyUseCase;
