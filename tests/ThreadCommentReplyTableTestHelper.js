/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentTableTestHelper = {
  async addOne({
    id = 'comment-123', commentId = 'comment-123', ownerId = 'user-123', content = 'Lorem ipsum reply to comment', createdAt = new Date().toISOString()
  }) {
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, ownerId, content, createdAt, updatedAt],
    };

    await pool.query(query);
  },

  async findOneById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows?.[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_replies WHERE 1=1');
  },
};

module.exports = ThreadCommentTableTestHelper;
