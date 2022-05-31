const NewThreadComment = require('../../../Domains/comments/entities/NewThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const newThreadComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.checkAvailibilityThreadById(newThreadComment.thread);
    return this._commentRepository.addComment(newThreadComment);
  }
}

module.exports = AddThreadCommentUseCase;
