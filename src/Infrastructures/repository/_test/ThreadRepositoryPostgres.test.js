const { nanoid } = require('nanoid');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {
  const user = {
    id: 'user-1234567',
    username: 'matthew',
    password: 'secret',
    fullname: 'Matthew C.',
  };

  const sampleThread = {
    title: 'Title 1',
    body: 'Body 1',
    owner: user.id,
  };

  const sampleThreadComment = {
    id: 'comment-1234567',
    owner: user.id,
    content: 'Ini komentar',
  };

  const sampleThreadCommentReply = {
    id: 'reply-1234567',
    comment: sampleThreadComment.id,
    owner: user.id,
    content: 'Ini balasan komentar',
  };

  beforeAll(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(user);
  });

  afterAll(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add one thread to database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      const addedThread = await threadRepository.addThread(new NewThread(sampleThread));
      expect(addedThread).toBeInstanceOf(AddedThread);
      sampleThread.id = addedThread.id;

      // Assert
      const thread = await ThreadTableTestHelper.findOneById(addedThread.id);
      expect(thread).toHaveProperty('id');
      expect(thread.title).toStrictEqual('Title 1');
      expect(thread.body).toStrictEqual('Body 1');
      expect(thread.owner).toStrictEqual(user.id);
    });
  });

  describe('checkAvailibilityThreadById function', () => {
    it('should return nothing if found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(threadRepository, 'checkAvailibilityThreadById');

      // Action & Assert
      await threadRepository.checkAvailibilityThreadById(sampleThread.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkAvailibilityThreadById('thread-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should retrieve one thread detail', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
      await ThreadCommentTableTestHelper
        .addThreadComment({ ...sampleThreadComment, thread: sampleThread.id });
      await ThreadCommentReplyTableTestHelper.addCommentReply(sampleThreadCommentReply);

      // Action & Assert
      const thread = await threadRepository.getThreadById(sampleThread.id);
      expect(thread).toBeInstanceOf(ExistingThread);
      expect(thread.id).toStrictEqual(sampleThread.id);
      expect(thread.title).toStrictEqual(sampleThread.title);
      expect(thread.body).toStrictEqual(sampleThread.body);
      expect(thread.owner).toStrictEqual(sampleThread.owner);
      expect(thread.username).toStrictEqual(user.username);
    });

    it('should throw if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.getThreadById('thread-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
