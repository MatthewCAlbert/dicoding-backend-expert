class GetOneById {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, userId, threadId, commentId,
    } = payload;

    this.id = id;
    this.userId = userId;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyPayload({
    id, threadId, commentId, userId,
  }) {
    if (!id) {
      throw new Error('GET_ONE_BY_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new Error('GET_ONE_BY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (userId && typeof userId !== 'string') {
      throw new Error('GET_ONE_BY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (threadId && typeof threadId !== 'string') {
      throw new Error('GET_ONE_BY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (commentId && typeof commentId !== 'string') {
      throw new Error('GET_ONE_BY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetOneById;
