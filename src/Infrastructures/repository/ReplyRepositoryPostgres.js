const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThreadCommentReply = require('../../Domains/replies/entities/AddedThreadCommentReply');
const ExistingThreadCommentReply = require('../../Domains/replies/entities/ExistingThreadCommentReply');
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

    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4) RETURNING id, comment, owner, content',
      values: [id, comment, owner, content],
    };

    await this._pool.query(query);

    return new AddedThreadCommentReply({ ...newThreadCommentReply, id });
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

  async getCommentRepliesByThreadId(threadId) {
    const query = {
      text: `
        SELECT thread_comment_replies.comment AS comment ,thread_comment_replies.id, thread_comment_replies.content, thread_comment_replies."createdAt" AS "date", users.username, thread_comment_replies."deletedAt", thread_comment_replies.owner 
        FROM thread_comment_replies 
          LEFT JOIN thread_comments ON thread_comment_replies.comment = thread_comments.id
          LEFT JOIN users ON users.id = thread_comment_replies.owner 
          WHERE thread_comments.thread = $1 
          ORDER BY thread_comment_replies."createdAt" ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result?.rows?.map((e) => new ExistingThreadCommentReply(e));
  }
}

module.exports = ReplyRepositoryPostgres;
