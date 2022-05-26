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

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, thread, owner, content',
      values: [id, thread, owner, content],
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

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT thread_comments.id, users.username, thread_comments."createdAt" AS "date", thread_comments.content, thread_comments."deletedAt"
        FROM thread_comments 
          LEFT JOIN users ON users.id = thread_comments.owner 
          WHERE thread_comments.thread = $1 
          ORDER BY thread_comments."createdAt" ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result?.rows;
  }
}

module.exports = CommentRepositoryPostgres;
