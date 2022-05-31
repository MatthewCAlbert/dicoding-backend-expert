const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedThreadComment = require('../../Domains/comments/entities/AddedThreadComment');
const ExistingThreadComment = require('../../Domains/comments/entities/ExistingThreadComment');

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

    return new AddedThreadComment({ ...newThreadComment, id });
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
        SELECT thread_comments.id, thread_comments.thread, users.username, thread_comments.owner, thread_comments."createdAt" AS "date", thread_comments.content, thread_comments."deletedAt"
        FROM thread_comments 
          LEFT JOIN users ON users.id = thread_comments.owner 
          WHERE thread_comments.thread = $1 
          ORDER BY thread_comments."createdAt" ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result?.rows?.map((e) => new ExistingThreadComment({ ...e, likeCount: 0 }));
  }
}

module.exports = CommentRepositoryPostgres;
