const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ExistingThread = require('../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
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

  async checkAvailibilityThreadById(threadId) {
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

  async getThreadById(threadId) {
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
}

module.exports = ThreadRepositoryPostgres;
