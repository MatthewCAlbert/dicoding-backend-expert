class ExistingThreadCommentLikeCount {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      comment, likes,
    } = payload;

    this.comment = comment;
    this.likes = likes;
  }

  _verifyPayload({
    comment, likes,
  }) {
    if (!comment || (likes === undefined || likes === null)) {
      throw new Error('EXISTING_THREAD_COMMENT_LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof comment !== 'string' || typeof likes !== 'number') {
      throw new Error('EXISTING_THREAD_COMMENT_LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ExistingThreadCommentLikeCount;
