class AddedThreadCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, comment, owner, content,
    } = payload;

    this.id = id;
    this.comment = comment;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    id, comment, owner, content,
  }) {
    if (!id || !comment || !owner || !content) {
      throw new Error('ADDED_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof comment !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThreadCommentReply;
