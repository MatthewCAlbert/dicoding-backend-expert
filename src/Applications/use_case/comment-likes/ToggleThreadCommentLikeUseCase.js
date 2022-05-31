const NewThreadCommentLike = require('../../../Domains/comment-likes/entities/NewThreadCommentLike');

class ToggleThreadCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const { id: threadCommentId, userId, threadId } = useCasePayload;

    await this._threadRepository.checkAvailibilityThreadById(threadId);
    await this._commentRepository.checkAvailibilityCommentById(threadCommentId);
    const alreadyLikedId = await this._commentLikeRepository
      .findCommentLikeId(threadCommentId, userId);

    if (alreadyLikedId) {
      return this._commentLikeRepository.deleteCommentLike(alreadyLikedId);
    }

    const newThreadComment = new NewThreadCommentLike({
      comment: threadCommentId,
      owner: userId,
    });
    return this._commentLikeRepository.addCommentLike(newThreadComment);
  }
}

module.exports = ToggleThreadCommentLikeUseCase;
