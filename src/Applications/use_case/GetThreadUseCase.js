const GetOneById = require('../../Domains/threads/entities/GetOneById');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { id } = new GetOneById(useCasePayload);
    const thread = await this._threadRepository.getThreadById(id);
    const rawComments = await this._commentRepository.getCommentsByThreadId(id);
    const rawReplies = await this._replyRepository.getCommentRepliesByThreadId(id);

    return new ExistingThread({
      ...thread, rawComments, rawReplies,
    });
  }
}

module.exports = GetThreadUseCase;
