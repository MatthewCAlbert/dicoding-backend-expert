const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addThread = this.addThread.bind(this);
    this.getThreadDetail = this.getThreadDetail.bind(this);
  }

  async addThread(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread({
      ...request.payload, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: addedThread.owner,
        },
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetail(request) {
    const { id } = request.params;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.getThreadDetail({ id });
    delete thread.owner;

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandler;
