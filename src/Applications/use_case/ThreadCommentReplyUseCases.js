const NewThreadCommentReply = require('../../Domains/replies/entities/NewThreadCommentReply');

class ThreadCommentReplyUseCases {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addCommentReply(useCasePayload) {
    const newThreadCommentReply = new NewThreadCommentReply(useCasePayload);
    await this._commentRepository.checkAvailibilityCommentById(newThreadCommentReply.comment);
    await this._threadRepository.checkAvailibilityThreadById(newThreadCommentReply.thread);
    return this._replyRepository.addCommentReply(newThreadCommentReply);
  }

  async deleteCommentReply(useCasePayload) {
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

module.exports = ThreadCommentReplyUseCases;
