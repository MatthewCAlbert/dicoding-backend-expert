const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const NewThreadCommentReply = require('../../../Domains/threads/entities/NewThreadCommentReply');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const { nanoid } = require('nanoid');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  const user = {
    id: 'user-1234567',
    username: 'matthew',
    password: 'secret',
    fullname: "Matthew C."
  }

  beforeAll(async ()=> {
    UsersTableTestHelper.addUser(user)
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
  
  describe('addOne function', () => {
    it('should add one thread to database', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, nanoid);

      // Action
      const { id } = await threadRepository.addOne(new NewThread({
        title: 'Title 1',
        body: 'Body 1',
        owner: user.id
      }));

      // Assert
      const thread = await ThreadTableTestHelper.findOneById(id);
      expect(thread).toHaveProperty('id');
      expect(thread.title).toStrictEqual('Title 1');
      expect(thread.body).toStrictEqual('Body 1');
      expect(thread.owner).toStrictEqual(user.id);
    });
  });
});
