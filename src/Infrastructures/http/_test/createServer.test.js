const createServer = require('../createServer');
const container = require('../../container');

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });

  const user = {
    id: 'user-1234567',
    username: 'matthew',
    password: 'secret',
    fullname: "Matthew C."
  }

  it('should handle jwt validation', async () => {
    // Arrange
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UiLCJpZCI6InVzZXItSjdINGVGTHZsUHA1SkpUSGQyWTVYIiwiaWF0IjoxNjUyOTYzMDAzfQ.eowRgy7EZm0vnokWr1Yb-o8v8RbVCM9am1iMM2bhu4k'
      }
    });

    // Assert
    expect(response.statusCode).toEqual(400);
  });
});
