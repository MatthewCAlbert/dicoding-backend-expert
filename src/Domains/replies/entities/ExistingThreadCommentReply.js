class ExistingThreadCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, comment, owner, content, date, deletedAt,
    } = payload;

    this.id = id;
    this.username = username;
    this.comment = comment;
    this.owner = owner;
    this.content = deletedAt === null ? content : '**balasan telah dihapus**';
    this.date = date;
  }

  _verifyPayload({
    id, username, comment, owner, content, date,
  }) {
    if (!id || !username || !comment || !owner || !content || !date) {
      throw new Error('EXISTING_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof username !== 'string' || typeof comment !== 'string'
      || typeof owner !== 'string' || typeof content !== 'string' || typeof date !== 'object'
    ) {
      throw new Error('EXISTING_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingThreadCommentReply;
