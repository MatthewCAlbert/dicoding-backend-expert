const CommentLikeRepository = require('../../Domains/comment-likes/CommentLikeRepository');
const AddedThreadCommentLike = require('../../Domains/comment-likes/entities/AddedThreadCommentLike');
const ExistingThreadCommentLikeCount = require('../../Domains/comment-likes/entities/ExistingThreadCommentLikeCount');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(newThreadCommentLike) {
    const { comment, owner } = newThreadCommentLike;
    const id = `comment-like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3, $4) RETURNING id, comment, owner',
      values: [id, comment, owner],
    };

    await this._pool.query(query);

    return new AddedThreadCommentLike({ ...newThreadCommentLike, id });
  }

  async deleteCommentLike(threadCommentLikeId) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE id = $1 ',
      values: [threadCommentLikeId],
    };

    await this._pool.query(query);
  }

  async findCommentLikeId(threadCommentId, userId) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE comment = $1 AND owner = $2',
      values: [threadCommentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return result?.rows?.[0].id;
  }

  async getCommentLikesByThreadId(threadId) {
    const query = {
      text: `
        SELECT thread_comments.id AS comment, COUNT(thread_comment_likes.id) AS likes
        FROM thread_comments 
          LEFT JOIN thread_comment_likes ON thread_comments.id = thread_comment_likes.comment 
          WHERE thread_comments.thread = $1 
          GROUP BY thread_comments.id
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result?.rows?.map(
      (e) => new ExistingThreadCommentLikeCount({ ...e, likes: parseInt(e.likes, 10) }));
  }
}

module.exports = CommentLikeRepositoryPostgres;
