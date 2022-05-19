const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addOne(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, owner, title, body, "createdAt", "updatedAt"',
      values: [id, owner, title, body, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new ExistingThread({ ...result.rows[0], createdAt, updatedAt });
  }

  async checkOneById(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getOneById(threadId) {
    const threadQuery = {
      text: `
        SELECT threads.*, users.username FROM threads 
          LEFT JOIN users ON users.id = threads.owner 
          WHERE threads.id = $1
      `,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (!threadResult.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const commentsQuery = {
      text: `
        SELECT thread_comments.id, users.username, thread_comments."createdAt" AS "date", thread_comments.content, thread_comments."deletedAt"
        FROM thread_comments 
          LEFT JOIN users ON users.id = thread_comments.owner 
          WHERE thread_comments.thread = $1 
          ORDER BY thread_comments."createdAt" ASC
      `,
      values: [threadId],
    };

    const commentsResult = await this._pool.query(commentsQuery);

    const repliesQuery = {
      text: `
        SELECT thread_comment_replies.comment AS "commentId" ,thread_comment_replies.id, thread_comment_replies.content, thread_comment_replies."createdAt" AS "date", users.username, thread_comment_replies."deletedAt"
        FROM thread_comment_replies 
          LEFT JOIN thread_comments ON thread_comment_replies.comment = thread_comments.id
          LEFT JOIN users ON users.id = thread_comment_replies.owner 
          WHERE thread_comments.thread = $1 
          ORDER BY thread_comment_replies."createdAt" ASC
      `,
      values: [threadId],
    };

    const repliesResult = await this._pool.query(repliesQuery);

    const thread = threadResult.rows[0];

    return new ExistingThread({
      ...thread, rawComments: commentsResult?.rows, rawReplies: repliesResult?.rows,
    });
  }

  async addOneComment(newThreadComment) {
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

  async deleteOneComment(commentId) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comments SET "deletedAt" = $1 WHERE id = $2 ',
      values: [deletedAt, commentId],
    };

    await this._pool.query(query);
  }

  async checkOneCommentById(threadCommentId) {
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

  async addOneCommentReply(newThreadCommentReply) {
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

  async deleteOneCommentReply(replyId) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comment_replies SET "deletedAt" = $1 WHERE id = $2 ',
      values: [deletedAt, replyId],
    };

    await this._pool.query(query);
  }

  async checkOneCommentReplyById(threadCommentReplyId) {
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

module.exports = ThreadRepositoryPostgres;
