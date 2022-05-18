/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableTestHelper = {
  async addOne({
    id = 'comment-123', threadId = 'thread-123', ownerId = 'user-123', content = 'Lorem ipsum comment', createdAt = new Date().toISOString()
  }) {
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, ownerId, content, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findOneById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentTableTestHelper;
