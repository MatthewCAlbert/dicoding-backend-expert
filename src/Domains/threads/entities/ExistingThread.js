class ExistingThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, owner, createdAt, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    this.username = username;
    this.date = createdAt;
    this.comments = comments || [];
  }

  _verifyPayload({
    id, title, body, owner,
  }) {
    if (!id || !title || !body || !owner) {
      throw new Error('EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingThread;
