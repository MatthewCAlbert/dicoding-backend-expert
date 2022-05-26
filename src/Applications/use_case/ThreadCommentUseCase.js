const NewThreadComment = require('../../Domains/comments/entities/NewThreadComment');
const GetOneById = require('../../Domains/threads/entities/GetOneById');

class ThreadCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThreadComment(useCasePayload) {
    const newThreadComment = new NewThreadComment(useCasePayload);
    await this._threadRepository.checkAvailibilityThreadById(newThreadComment.thread);
    return this._commentRepository.addComment(newThreadComment);
  }

  async deleteThreadComment(useCasePayload) {
    const { id: threadCommentId, userId, threadId } = new GetOneById(useCasePayload);
    await this._commentRepository.checkAvailibilityCommentById(threadCommentId);
    await this._threadRepository.checkAvailibilityThreadById(threadId);
    await this._commentRepository.checkCommentOwnership(threadCommentId, userId);
    return this._commentRepository.deleteComment(threadCommentId);
  }
}

module.exports = ThreadCommentUseCase;
