class DeleteCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      id: threadCommentReplyId, userId, threadId, commentId,
    } = useCasePayload;
    await this._replyRepository.checkAvailibilityReplyById(threadCommentReplyId);
    await this._commentRepository.checkAvailibilityCommentById(commentId);
    await this._threadRepository.checkAvailibilityThreadById(threadId);
    await this._replyRepository.checkCommentReplyOwnership(threadCommentReplyId, userId);
    return this._replyRepository.deleteCommentReply(threadCommentReplyId);
  }
}

module.exports = DeleteCommentReplyUseCase;
