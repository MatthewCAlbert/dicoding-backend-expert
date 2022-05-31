class AddedThreadCommentLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, comment, owner,
    } = payload;

    this.id = id;
    this.comment = comment;
    this.owner = owner;
  }

  _verifyPayload({
    id, comment, owner,
  }) {
    if (!id || !comment || !owner) {
      throw new Error('ADDED_THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThreadCommentLike;
