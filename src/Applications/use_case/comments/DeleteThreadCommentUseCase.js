class DeleteThreadCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id: threadCommentId, userId, threadId } = useCasePayload;
    await this._commentRepository.checkAvailibilityCommentById(threadCommentId);
    await this._threadRepository.checkAvailibilityThreadById(threadId);
    await this._commentRepository.checkCommentOwnership(threadCommentId, userId);
    return this._commentRepository.deleteComment(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
