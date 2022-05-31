class AddedThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, thread, owner, content,
    } = payload;

    this.id = id;
    this.thread = thread;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    id, thread, owner, content,
  }) {
    if (!id || !thread || !owner || !content) {
      throw new Error('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof thread !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThreadComment;
