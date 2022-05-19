const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  const user = {
    username: 'matthewca',
    password: 'secret',
    fullname: 'Matthew C',
  };

  let auth = {};

  const sampleThread = {
    title: 'Title 1',
    body: 'Body 1',
  };

  beforeAll(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadCommentReplyTableTestHelper.cleanTable();
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('should login first', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      const addUserResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: user,
      });
      const responseJson = JSON.parse(addUserResponse.payload);
      user.id = responseJson.data.addedUser.id;
      auth = {
        strategy: 'forumapi_jwt',
        credentials: {
          id: responseJson.data.addedUser.id,
        },
      };
    });
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: sampleThread,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toStrictEqual(sampleThread.title);
      expect(responseJson.data.addedThread.owner).toStrictEqual(user.id);
      sampleThread.id = responseJson.data.addedThread.id;
    });

    it('should response 401 not authorized', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: sampleThread,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 bad payload', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: '',
        },
        auth,
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 200 and persisted thread', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${sampleThread.id}`,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toStrictEqual(sampleThread.title);
      expect(responseJson.data.thread.body).toStrictEqual(sampleThread.body);
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toStrictEqual(user.username);
      expect(responseJson.data.thread.comments).toBeDefined();
    });

    it('should response 404 not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-xxx',
        payload: sampleThread,
      });
      expect(response.statusCode).toEqual(404);
    });
  });

  const sampleThreadComment = {
    content: 'Ini komentar',
  };

  describe('when POST /threads/{id}/comments', () => {
    it('should response 201 and persisted thread comment', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${sampleThread.id}/comments`,
        payload: sampleThreadComment,
        auth,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toStrictEqual(sampleThreadComment.content);
      expect(responseJson.data.addedComment.owner).toStrictEqual(user.id);
      sampleThreadComment.id = responseJson.data.addedComment.id;
    });

    it('should response 404 not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments',
        payload: sampleThreadComment,
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
        url: `/threads/${sampleThread.id}/comments`,
        payload: sampleThreadComment,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 bad payload', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${sampleThread.id}/comments`,
        payload: {
          content: 123,
        },
        auth,
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('when DELETE /threads/{id}/comments/{commentId}', () => {
    it('should response 200', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}`,
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
        url: '/threads/thread-xxx/comments/comment-xxx',
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
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}`,
      });
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 forbidden due to different owner', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${sampleThread.id}/comments/${sampleThreadComment.id}`,
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
