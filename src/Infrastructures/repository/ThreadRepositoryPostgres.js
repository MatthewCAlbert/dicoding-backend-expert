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

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, owner, title, body',
      values: [id, owner, title, body],
    };

    const result = await this._pool.query(query);

    return new ExistingThread({ ...result.rows[0] });
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

    const thread = threadResult.rows[0];

    return thread;
  }
}

module.exports = ThreadRepositoryPostgres;
