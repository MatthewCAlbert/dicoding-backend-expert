const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      thread: 'thread-xxx',
      owner: 312312,
      content: 'Isi Badan',
    };

    // Action & Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThreadComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      thread: 'thread-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
    };

    // Action
    const addedThreadComment = new AddedThreadComment(payload);

    // Assert
    expect(addedThreadComment).toBeInstanceOf(AddedThreadComment);
    expect(addedThreadComment.id).toEqual(payload.id);
    expect(addedThreadComment.thread).toEqual(payload.thread);
    expect(addedThreadComment.owner).toEqual(payload.owner);
    expect(addedThreadComment.content).toEqual(payload.content);
  });
});
