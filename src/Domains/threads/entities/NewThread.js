class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      title, body, owner,
    } = payload;

    this.title = title;
    this.owner = owner;
    this.body = body;
  }

  _verifyPayload({
    title, body, owner,
  }) {
    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
