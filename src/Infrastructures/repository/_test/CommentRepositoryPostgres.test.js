const { nanoid } = require('nanoid');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThreadComment = require('../../../Domains/comments/entities/NewThreadComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ExistingThreadComment = require('../../../Domains/comments/entities/ExistingThreadComment');
const AddedThreadComment = require('../../../Domains/comments/entities/AddedThreadComment');

describe('CommentRepositoryPostgres', () => {
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

  beforeAll(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(user);
    await ThreadTableTestHelper.addThread(sampleThread);
  });

  afterAll(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const sampleThreadComment = {
    owner: user.id,
    content: 'Ini komentar',
  };

  describe('addComment function', () => {
    it('should add one thread comment to database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

      // Action
      const addedComment = await commentRepository
        .addComment(new NewThreadComment({ ...sampleThreadComment, thread: sampleThread.id }));
      expect(addedComment).toBeInstanceOf(AddedThreadComment);
      sampleThreadComment.id = addedComment.id;

      // Assert
      const threadComment = await ThreadCommentTableTestHelper.findOneById(addedComment.id);
      expect(threadComment).toHaveProperty('id');
      expect(threadComment.content).toStrictEqual(sampleThreadComment.content);
      expect(threadComment.thread).toStrictEqual(sampleThread.id);
      expect(threadComment.owner).toStrictEqual(user.id);
    });
  });

  describe('checkAvailibilityCommentById function', () => {
    it('should return nothing if found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(commentRepository, 'checkAvailibilityCommentById');

      // Action & Assert
      await commentRepository.checkAvailibilityCommentById(sampleThreadComment.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await commentRepository.checkAvailibilityCommentById('comment-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwnership function', () => {
    it('should be okay if owned', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(commentRepository, 'checkCommentOwnership');

      // Action & Assert
      await commentRepository.checkCommentOwnership(sampleThreadComment.id, user.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not owned', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await commentRepository.checkCommentOwnership(sampleThreadComment.id, 'user-xxx');
      })
        .rejects
        .toThrow(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should get thread comments by thread id from database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const threadComments = await commentRepository.getCommentsByThreadId(sampleThread.id);
      expect(threadComments).toHaveLength(1);
      expect(threadComments[0]).toBeInstanceOf(ExistingThreadComment);
      expect(threadComments[0].id).toStrictEqual(sampleThreadComment.id);
      expect(threadComments[0].username).toStrictEqual(user.username);
      expect(threadComments[0].owner).toStrictEqual(sampleThreadComment.owner);
      expect(threadComments[0].content).toStrictEqual(sampleThreadComment.content);
      expect(threadComments[0].likeCount).toStrictEqual(0);
      expect(threadComments[0]).toHaveProperty('date');
      expect(threadComments[0]).toHaveProperty('replies');
    });
  });

  describe('deleteComment function', () => {
    it('should delete one thread comment from database', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, nanoid);

      // Action
      await commentRepository.deleteComment(sampleThreadComment.id);

      // Assert
      const threadComment = await ThreadCommentTableTestHelper.findOneById(sampleThreadComment.id);
      expect(threadComment.deletedAt).not.toBeNull();
    });
  });
});
