const { nanoid } = require('nanoid');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentLikeTableTestHelper = require('../../../../tests/ThreadCommentLikeTableTestHelper');
const NewThreadCommentLike = require('../../../Domains/comment-likes/entities/NewThreadCommentLike');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  const user = {
    id: 'user-1234567',
    username: 'matthew',
    password: 'secret',
    fullname: 'Matthew C.',
  };

  const sampleThread = {
    id: 'thread-1234567',
    title: 'Title 1',
    body: 'Body 1',
    owner: user.id,
  };

  const sampleThreadComment = {
    id: 'comment-1234567',
    thread: sampleThread.id,
    owner: user.id,
    content: 'Ini komentar',
  };

  beforeAll(async () => {
    await ThreadCommentLikeTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(user);
    await ThreadTableTestHelper.addThread(sampleThread);
    await ThreadCommentTableTestHelper.addThreadComment(sampleThreadComment);
  });

  afterAll(async () => {
    await ThreadCommentLikeTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const sampleThreadCommentLike = {
    owner: user.id,
    comment: sampleThreadComment.id,
  };

  describe('addCommentLike function', () => {
    it('should add one thread comment to database', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, nanoid);

      // Action
      const { id } = await commentLikeRepository
        .addCommentLike(new NewThreadCommentLike(sampleThreadCommentLike));
      sampleThreadCommentLike.id = id;

      // Assert
      const threadCommentLike = await ThreadCommentLikeTableTestHelper.findOneById(id);
      expect(threadCommentLike).toHaveProperty('id');
      expect(threadCommentLike.comment).toStrictEqual(sampleThreadComment.id);
      expect(threadCommentLike.owner).toStrictEqual(user.id);
    });
  });

  describe('checkAvailibilityCommentLike function', () => {
    it('should return id if found', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const result = await commentLikeRepository
        .checkAvailibilityCommentLike(sampleThreadComment.id, user.id);
      expect(result).toStrictEqual(sampleThreadCommentLike.id);
    });
    it('should return false if not found', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const result = await commentLikeRepository
        .checkAvailibilityCommentLike('comment-xxx', user.id);
      expect(result).toStrictEqual(false);
    });
  });

  describe('getCommentLikesByThreadId function', () => {
    it('should get thread comments by thread id from database', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const threadComments = await commentLikeRepository.getCommentLikesByThreadId(sampleThread.id);
      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].likes).toStrictEqual('1');
      expect(threadComments[0].threadCommentId).toStrictEqual(sampleThreadComment.id);
    });
  });

  describe('deleteCommentLike function', () => {
    it('should delete one thread comment from database', async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, nanoid);

      // Action
      await commentLikeRepository.deleteCommentLike(sampleThreadCommentLike.id);

      // Assert
      const threadComment = await ThreadCommentLikeTableTestHelper
        .findOneById(sampleThreadCommentLike.id);
      expect(threadComment).toBeUndefined();
    });
  });
});
