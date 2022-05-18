const GetOneById = require('../GetOneById');

describe('GetOneById entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-xxx',
    };

    // Action & Assert
    expect(() => new GetOneById(payload)).toThrowError('GET_ONE_BY_ID.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'sample-xxx',
      userId: 'user-xxx',
      threadId: 123445,
      commentId: 'comment-xxx'
    };

    // Action & Assert
    expect(() => new GetOneById(payload)).toThrowError('GET_ONE_BY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetOneById entities correctly', () => {
    // Arrange
    const payload = {
      id: 'sample-xxx',
      userId: 'user-xxx',
      threadId: 'thread-xxx',
      commentId: 'comment-xxx'
    };

    // Action
    const getOneById = new GetOneById(payload);

    // Assert
    expect(getOneById).toBeInstanceOf(GetOneById);
    expect(getOneById.id).toBe(payload.id);
    expect(getOneById.userId).toBe(payload.userId);
    expect(getOneById.threadId).toBe(payload.threadId);
    expect(getOneById.commentId).toBe(payload.commentId);
  });
});
