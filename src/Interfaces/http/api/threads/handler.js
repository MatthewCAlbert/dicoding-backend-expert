const ThreadUseCases = require('../../../../Applications/use_case/ThreadUseCases');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addThread = this.addThread.bind(this);
    this.getThreadDetail = this.getThreadDetail.bind(this);
  }

  async addThread(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const addedThread = await threadUseCases.addThread({
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
    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const thread = await threadUseCases.getThreadDetail({ id });
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
