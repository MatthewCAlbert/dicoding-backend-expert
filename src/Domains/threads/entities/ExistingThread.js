class ExistingThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, owner, createdAt, username,
      rawComments, rawReplies,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    this.username = username;
    this.date = createdAt;
    this.comments = rawComments?.map((comment) => {
      const replies = rawReplies
        ?.filter((reply) => reply.commentId === comment.id)
        ?.map((reply) => ({
          id: reply.id,
          username: reply.username,
          date: reply.date,
          content: reply.deletedAt === null ? reply.content : '**balasan telah dihapus**',
        }));
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.deletedAt === null ? comment.content : '**komentar telah dihapus**',
        replies: replies || [],
      };
    }) || [];
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
