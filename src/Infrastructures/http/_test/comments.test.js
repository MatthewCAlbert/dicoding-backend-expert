const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{id}/comments endpoint', () => {
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
});
