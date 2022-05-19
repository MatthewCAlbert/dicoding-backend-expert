const { nanoid } = require('nanoid');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const NewThreadCommentReply = require('../../../Domains/threads/entities/NewThreadCommentReply');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

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

  describe('addOne function', () => {
    it('should add one thread to database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      const { id } = await threadRepository.addOne(new NewThread(sampleThread));
      sampleThread.id = id;

      // Assert
      const thread = await ThreadTableTestHelper.findOneById(id);
      expect(thread).toHaveProperty('id');
      expect(thread.title).toStrictEqual('Title 1');
      expect(thread.body).toStrictEqual('Body 1');
      expect(thread.owner).toStrictEqual(user.id);
    });
  });

  describe('checkOneById function', () => {
    it('should return id if found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const id = await threadRepository.checkOneById(sampleThread.id);
      expect(id).toStrictEqual(sampleThread.id);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkOneById('thread-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  const sampleThreadComment = {
    owner: user.id,
    content: 'Ini komentar',
  };

  describe('addOneComment function', () => {
    it('should add one thread comment to database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      const { id } = await threadRepository
        .addOneComment(new NewThreadComment({ ...sampleThreadComment, thread: sampleThread.id }));
      sampleThreadComment.id = id;

      // Assert
      const threadComment = await ThreadCommentTableTestHelper.findOneById(id);
      expect(threadComment).toHaveProperty('id');
      expect(threadComment.content).toStrictEqual(sampleThreadComment.content);
      expect(threadComment.thread).toStrictEqual(sampleThread.id);
      expect(threadComment.owner).toStrictEqual(user.id);
    });
  });

  describe('checkOneCommentById function', () => {
    it('should return id if found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const id = await threadRepository.checkOneCommentById(sampleThreadComment.id);
      expect(id).toStrictEqual(sampleThreadComment.id);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkOneCommentById('comment-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('checkCommentOwnership function', () => {
    it('should be okay if owned', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(threadRepository, 'checkCommentOwnership');

      // Action & Assert
      await threadRepository.checkCommentOwnership(sampleThreadComment.id, user.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not owned', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkCommentOwnership(sampleThreadComment.id, 'user-xxx');
      })
        .rejects
        .toThrow(AuthorizationError);
    });
  });

  const sampleThreadCommentReply = {
    owner: user.id,
    content: 'Ini balasan komentar',
  };

  describe('addOneCommentReply function', () => {
    it('should add one thread comment reply to database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      const { id } = await threadRepository.addOneCommentReply(new NewThreadCommentReply({
        ...sampleThreadCommentReply, comment: sampleThreadComment.id, thread: sampleThread.id,
      }));
      sampleThreadCommentReply.id = id;

      // Assert
      const threadCommentReply = await ThreadCommentReplyTableTestHelper.findOneById(id);
      expect(threadCommentReply).toHaveProperty('id');
      expect(threadCommentReply.content).toStrictEqual(sampleThreadCommentReply.content);
      expect(threadCommentReply.comment).toStrictEqual(sampleThreadComment.id);
      expect(threadCommentReply.owner).toStrictEqual(user.id);
    });
  });

  describe('checkOneCommentReplyById function', () => {
    it('should return id if found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const id = await threadRepository.checkOneCommentReplyById(sampleThreadCommentReply.id);
      expect(id).toStrictEqual(sampleThreadCommentReply.id);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkOneCommentReplyById('reply-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('checkCommentReplyOwnership function', () => {
    it('should be okay if owned', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(threadRepository, 'checkCommentReplyOwnership');

      // Action & Assert
      await threadRepository.checkCommentReplyOwnership(sampleThreadCommentReply.id, user.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not owned', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.checkCommentReplyOwnership(sampleThreadCommentReply.id, 'user-xxx');
      })
        .rejects
        .toThrow(AuthorizationError);
    });
  });

  describe('getOneById function', () => {
    it('should retrieve one thread detail', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const thread = await threadRepository.getOneById(sampleThread.id);
      expect(thread).toBeInstanceOf(ExistingThread);
      expect(thread.id).toStrictEqual(sampleThread.id);
      expect(thread.id.length).toBeGreaterThan(0);
      expect(thread.title).toStrictEqual(sampleThread.title);
      expect(thread.body).toStrictEqual(sampleThread.body);
      expect(thread.owner).toStrictEqual(sampleThread.owner);
      expect(thread.username).toStrictEqual(user.username);
      expect(thread).toHaveProperty('comments');
      expect(thread.comments).toHaveLength(1);
      expect(thread.comments[0]).toHaveProperty('replies');
      expect(thread.comments[0].replies).toHaveLength(1);
      expect(thread).toHaveProperty('date');
    });

    it('should throw if not found', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await threadRepository.getOneById('thread-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('deleteOneCommentReply function', () => {
    it('should delete one thread comment reply from database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      await threadRepository.deleteOneCommentReply(sampleThreadCommentReply.id);

      // Assert
      const threadCommentReply = await ThreadCommentReplyTableTestHelper
        .findOneById(sampleThreadCommentReply.id);
      expect(threadCommentReply.deletedAt).not.toBeNull();
    });
  });

  describe('deleteOneComment function', () => {
    it('should delete one thread comment from database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      await threadRepository.deleteOneComment(sampleThreadComment.id);

      // Assert
      const threadComment = await ThreadCommentTableTestHelper.findOneById(sampleThreadComment.id);
      expect(threadComment.deletedAt).not.toBeNull();
    });
  });
});
