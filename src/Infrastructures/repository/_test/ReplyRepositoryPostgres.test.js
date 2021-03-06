const { nanoid } = require('nanoid');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThreadCommentReply = require('../../../Domains/replies/entities/NewThreadCommentReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ExistingThreadCommentReply = require('../../../Domains/replies/entities/ExistingThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/replies/entities/AddedThreadCommentReply');

describe('ReplyRepositoryPostgres', () => {
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
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(user);
    await ThreadTableTestHelper.addThread(sampleThread);
    await ThreadCommentTableTestHelper.addThreadComment(sampleThreadComment);
  });

  afterAll(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const sampleThreadCommentReply = {
    owner: user.id,
    content: 'Ini balasan komentar',
  };

  describe('addCommentReply function', () => {
    it('should add one thread comment reply to database', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);

      // Action
      const addedReply = await replyRepository.addCommentReply(new NewThreadCommentReply({
        ...sampleThreadCommentReply, comment: sampleThreadComment.id, thread: sampleThread.id,
      }));
      expect(addedReply).toBeInstanceOf(AddedThreadCommentReply);
      sampleThreadCommentReply.id = addedReply.id;

      // Assert
      const threadCommentReply = await ThreadCommentReplyTableTestHelper.findOneById(addedReply.id);
      expect(threadCommentReply).toHaveProperty('id');
      expect(threadCommentReply.content).toStrictEqual(sampleThreadCommentReply.content);
      expect(threadCommentReply.comment).toStrictEqual(sampleThreadComment.id);
      expect(threadCommentReply.owner).toStrictEqual(user.id);
    });
  });

  describe('checkAvailibilityReplyById function', () => {
    it('should return nothing if found', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(replyRepository, 'checkAvailibilityReplyById');

      // Action & Assert
      await replyRepository.checkAvailibilityReplyById(sampleThreadCommentReply.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not found', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await replyRepository.checkAvailibilityReplyById('reply-xxx');
      })
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('checkCommentReplyOwnership function', () => {
    it('should be okay if owned', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);
      const spy = jest.spyOn(replyRepository, 'checkCommentReplyOwnership');

      // Action & Assert
      await replyRepository.checkCommentReplyOwnership(sampleThreadCommentReply.id, user.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw error if not owned', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);

      // Action & Assert
      expect(async () => {
        await replyRepository.checkCommentReplyOwnership(sampleThreadCommentReply.id, 'user-xxx');
      })
        .rejects
        .toThrow(AuthorizationError);
    });
  });

  describe('getCommentRepliesByThreadId function', () => {
    it('should get thread comment replies by thread id from database', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);

      // Action & Assert
      const threadCommentReplies = await replyRepository
        .getCommentRepliesByThreadId(sampleThread.id);
      expect(threadCommentReplies).toHaveLength(1);
      expect(threadCommentReplies[0]).toBeInstanceOf(ExistingThreadCommentReply);
      expect(threadCommentReplies[0].id).toStrictEqual(sampleThreadCommentReply.id);
      expect(threadCommentReplies[0].owner).toStrictEqual(sampleThreadCommentReply.owner);
      expect(threadCommentReplies[0].comment).toStrictEqual(sampleThreadComment.id);
      expect(threadCommentReplies[0].username).toStrictEqual(user.username);
      expect(threadCommentReplies[0].content).toStrictEqual(sampleThreadCommentReply.content);
      expect(threadCommentReplies[0]).toHaveProperty('date');
    });
  });

  describe('deleteCommentReply function', () => {
    it('should delete one thread comment reply from database', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, nanoid);

      // Action
      await replyRepository.deleteCommentReply(sampleThreadCommentReply.id);

      // Assert
      const threadCommentReply = await ThreadCommentReplyTableTestHelper
        .findOneById(sampleThreadCommentReply.id);
      expect(threadCommentReply.deletedAt).not.toBeNull();
    });
  });
});
