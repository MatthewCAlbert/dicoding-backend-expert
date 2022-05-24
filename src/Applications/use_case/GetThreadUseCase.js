const GetOneById = require('../../Domains/threads/entities/GetOneById');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id } = new GetOneById(useCasePayload);
    return this._threadRepository.getThreadById(id);
  }
}

module.exports = GetThreadUseCase;
