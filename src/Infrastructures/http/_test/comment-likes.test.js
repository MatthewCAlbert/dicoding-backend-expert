const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentLikeTableTestHelper = require('../../../../tests/ThreadCommentLikeTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  const user = {
    id: 'user-1234567',
    username: 'matthewca',
    password: 'secret',
    fullname: 'Matthew C',
  };

  const auth = {
    strategy: 'forumapi_jwt',
    credentials: {
      id: user.id,
    },
  };

  const sampleThread = {
    id: 'thread-1234567',
    owner: user.id,
    title: 'Title 1',
    body: 'Body 1',
  };

  const sampleThreadComment = {
    id: 'comment-1234567',
    owner: user.id,
    thread: sampleThread.id,
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

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and persisted thread comment like', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/likes`,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const threadCommentLike = await ThreadCommentLikeTableTestHelper
        .findOne({ userId: user.id, commentId: sampleThreadComment.id });
      expect(threadCommentLike).toBeDefined();
      expect(threadCommentLike.id).toBeDefined();
    });

    it('should response 200 and persisted thread comment like again', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/likes`,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson).toBeDefined();
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      const threadCommentLike = await ThreadCommentLikeTableTestHelper
        .findOne({ userId: user.id, commentId: sampleThreadComment.id });
      expect(threadCommentLike).toBeUndefined();
    });

    it('should response 404 not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${sampleThread.id}/comments/comment-xxx/likes`,
        auth,
      });
      expect(response.statusCode).toEqual(404);
    });

    it('should response 401 not authorized', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/likes`,
      });
      expect(response.statusCode).toEqual(401);
    });
  });
});
