const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentReply(newThreadCommentReply) {
    const { comment, owner, content } = newThreadCommentReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, comment, owner, content, "createdAt", "updatedAt"',
      values: [id, comment, owner, content, createdAt, updatedAt],
    };

    await this._pool.query(query);

    return { ...newThreadCommentReply, id };
  }

  async deleteCommentReply(replyId) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comment_replies SET "deletedAt" = $1 WHERE id = $2 ',
      values: [deletedAt, replyId],
    };

    await this._pool.query(query);
  }

  async checkAvailibilityReplyById(threadCommentReplyId) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [threadCommentReplyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan komentar thread tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async checkCommentReplyOwnership(threadCommentReplyId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1 AND owner = $2',
      values: [threadCommentReplyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('bukan pemilik balasan komentar thread');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
