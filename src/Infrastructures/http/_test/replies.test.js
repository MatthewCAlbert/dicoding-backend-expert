const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{id}/comments/{id}/replies endpoint', () => {
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
    content: 'Ini balasan komentar',
  };

  describe('when POST /threads/{id}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted thread comment reply', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies`,
        payload: sampleThreadCommentReply,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toStrictEqual(sampleThreadCommentReply.content);
      expect(responseJson.data.addedReply.owner).toStrictEqual(user.id);
      sampleThreadCommentReply.id = responseJson.data.addedReply.id;
    });

    it('should response 404 not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments/comment-xxx/replies',
        payload: sampleThreadCommentReply,
        auth,
      });
      expect(response.statusCode).toEqual(404);
    });

    it('should response 401 not authorized', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies`,
        payload: sampleThreadCommentReply,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 bad payload', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies`,
        payload: {
          content: 123,
        },
        auth,
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('when DELETE /threads/{id}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies/${sampleThreadCommentReply.id}`,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/comment-xxx/replies/reply-xxx',
        auth,
      });
      expect(response.statusCode).toEqual(404);
    });

    it('should response 401 not authorized', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies/${sampleThreadCommentReply.id}`,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 forbidden due to different owner', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}/replies/${sampleThreadCommentReply.id}`,
        auth: {
          ...auth,
          credentials: {
            id: 'user-xxx',
          },
        },
      });
      expect(response.statusCode).toEqual(403);
    });
  });
});
