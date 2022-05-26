const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.addThread = this.addThread.bind(this);
    this.getThreadDetail = this.getThreadDetail.bind(this);
  }

  async addThread(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
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
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute({ id });
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
