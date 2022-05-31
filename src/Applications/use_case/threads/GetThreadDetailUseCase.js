class GetThreadDetailUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(id);
    const rawComments = await this._commentRepository.getCommentsByThreadId(id);
    const rawReplies = await this._replyRepository.getCommentRepliesByThreadId(id);
    const rawCommentLikes = await this._commentLikeRepository.getCommentLikesByThreadId(id);

    thread.comments = rawComments.map((comment) => {
      const replies = rawReplies
        ?.filter((reply) => reply.comment === comment.id)
        ?.map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.content,
        }));
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.content,
        likeCount: rawCommentLikes
          ?.filter((likes) => likes.comment === comment.id)
          ?.[0]?.likes || 0,
        replies,
      };
    });

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
