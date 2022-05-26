/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentLikeTableTestHelper = {
  async addThreadComment({
    id = 'comment-like-123', comment = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, comment, owner],
    };

    await pool.query(query);
  },

  async findOneById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows?.[0];
  },

  async findOne({ userId, commentId }) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE owner = $1 AND comment = $2',
      values: [userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows?.[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comment_likes WHERE 1=1');
  },
};

module.exports = ThreadCommentLikeTableTestHelper;
