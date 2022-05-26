const GetOneById = require('../../Domains/threads/entities/GetOneById');
const NewThread = require('../../Domains/threads/entities/NewThread');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread');

class ThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
    this._replyRepository = replyRepository;
  }

  async addThread(useCasePayload) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }

  async getThreadDetail(useCasePayload) {
    const { id } = new GetOneById(useCasePayload);
    const thread = await this._threadRepository.getThreadById(id);
    const rawComments = await this._commentRepository.getCommentsByThreadId(id);
    const rawReplies = await this._replyRepository.getCommentRepliesByThreadId(id);
    const rawCommentLikes = await this._commentLikeRepository.getCommentLikesByThreadId(id);

    return new ExistingThread({
      ...thread, rawComments, rawReplies, rawCommentLikes,
    });
  }
}

module.exports = ThreadUseCase;
