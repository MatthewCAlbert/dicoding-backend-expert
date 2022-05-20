const jwtValidation = require('../jwtValidation');

describe('JWT HAPI Plugin Validate Function', () => {
  it('should work', async () => {
    const artifactsPayload = {
      decoded: {
        payload: {
          id: 'user-xxx',
        },
      },
    };
    const result = jwtValidation(artifactsPayload);
    expect(result.isValid).toBeTruthy();
    expect(result.credentials).toBeDefined();
    expect(result.credentials.id).toBeDefined();
  });
});
