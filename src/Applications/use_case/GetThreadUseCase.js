const GetOneById = require('../../Domains/threads/entities/GetOneById');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id } = new GetOneById(useCasePayload);
    return this._threadRepository.getOneById(id);
  }
}

module.exports = GetThreadUseCase;
