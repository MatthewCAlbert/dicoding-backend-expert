const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newThreadComment) {
    const { thread, owner, content } = newThreadComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread, owner, content, "createdAt", "updatedAt"',
      values: [id, thread, owner, content, createdAt, updatedAt],
    };

    await this._pool.query(query);

    return { ...newThreadComment, id };
  }

  async deleteComment(commentId) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comments SET "deletedAt" = $1 WHERE id = $2 ',
      values: [deletedAt, commentId],
    };

    await this._pool.query(query);
  }

  async checkAvailibilityCommentById(threadCommentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [threadCommentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar thread tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async checkCommentOwnership(threadCommentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND owner = $2',
      values: [threadCommentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('bukan pemilik komentar thread');
    }
  }
}

module.exports = CommentRepositoryPostgres;
