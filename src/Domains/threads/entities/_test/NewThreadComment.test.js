const NewThreadComment = require('../NewThreadComment');

describe('NewThreadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
      owner: 312312,
      content: 'Isi Badan',
    };

    // Action & Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
    };

    // Action
    const newThreadComment = new NewThreadComment(payload);

    // Assert
    expect(newThreadComment).toBeInstanceOf(NewThreadComment);
    expect(newThreadComment.thread).toEqual(payload.thread);
    expect(newThreadComment.owner).toEqual(payload.owner);
    expect(newThreadComment.content).toEqual(payload.content);
  });
});
