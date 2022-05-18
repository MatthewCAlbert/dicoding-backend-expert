class NewThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      thread, owner, content,
    } = payload;

    this.thread = thread;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    thread, owner, content,
  }) {
    if (!thread || !owner || !content) {
      throw new Error('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadComment;
