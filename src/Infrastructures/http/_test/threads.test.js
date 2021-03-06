const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const ThreadCommentReplyTableTestHelper = require('../../../../tests/ThreadCommentReplyTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
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
    title: 'Title 1',
    body: 'Body 1',
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
});
