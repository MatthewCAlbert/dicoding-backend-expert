class ExistingThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, thread, owner, content, likeCount, deletedAt, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = deletedAt === null ? content : '**komentar telah dihapus**';
    this.likeCount = likeCount;
    this.replies = replies || [];
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({
    id, username, date, thread, owner, content, likeCount,
  }) {
    if (!id || !username || !date || !thread || !owner || !content
      || (likeCount === undefined || likeCount === null)) {
      throw new Error('EXISTING_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object'
      || typeof thread !== 'string' || typeof owner !== 'string' || typeof content !== 'string'
      || typeof likeCount !== 'number'
    ) {
      throw new Error('EXISTING_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingThreadComment;
