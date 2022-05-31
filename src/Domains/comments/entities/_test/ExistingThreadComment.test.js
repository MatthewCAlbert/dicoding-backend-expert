const ExistingThreadComment = require('../ExistingThreadComment');

describe('ExistingThreadComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new ExistingThreadComment(payload)).toThrowError('EXISTING_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      username: 'user-xxx',
      date: new Date(),
      thread: 'thread-xxx',
      owner: 312312,
      likeCount: 0,
      content: 'Isi Badan',
    };

    // Action & Assert
    expect(() => new ExistingThreadComment(payload)).toThrowError('EXISTING_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ExistingThreadComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      username: 'user-xxx',
      date: new Date(),
      thread: 'thread-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
      likeCount: 0,
      deletedAt: null,
    };

    // Action
    const existingThreadComment = new ExistingThreadComment(payload);

    // Assert
    expect(existingThreadComment).toBeInstanceOf(ExistingThreadComment);
    expect(existingThreadComment.id).toEqual(payload.id);
    expect(existingThreadComment.username).toEqual(payload.username);
    expect(existingThreadComment.date).toEqual(payload.date);
    expect(existingThreadComment.thread).toEqual(payload.thread);
    expect(existingThreadComment.owner).toEqual(payload.owner);
    expect(existingThreadComment.content).toEqual(payload.content);
    expect(existingThreadComment.likeCount).toEqual(payload.likeCount);
    expect(existingThreadComment.replies).toHaveLength(0);
  });

  it('should create ExistingThreadComment entities that is deleted correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      username: 'user-xxx',
      date: new Date(),
      thread: 'thread-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
      deletedAt: new Date(),
      likeCount: 0,
    };

    // Action
    const existingThreadComment = new ExistingThreadComment(payload);

    // Assert
    expect(existingThreadComment).toBeInstanceOf(ExistingThreadComment);
    expect(existingThreadComment.id).toEqual(payload.id);
    expect(existingThreadComment.username).toEqual(payload.username);
    expect(existingThreadComment.date).toEqual(payload.date);
    expect(existingThreadComment.thread).toEqual(payload.thread);
    expect(existingThreadComment.owner).toEqual(payload.owner);
    expect(existingThreadComment.content).toEqual('**komentar telah dihapus**');
    expect(existingThreadComment.likeCount).toEqual(payload.likeCount);
    expect(existingThreadComment.replies).toHaveLength(0);
  });

  it('should create ExistingThreadComment entities with replies data correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-xxx',
      username: 'user-xxx',
      date: new Date(),
      thread: 'thread-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
      likeCount: 0,
      replies: [],
      deletedAt: null,
    };

    // Action
    const existingThreadComment = new ExistingThreadComment(payload);

    // Assert
    expect(existingThreadComment).toBeInstanceOf(ExistingThreadComment);
    expect(existingThreadComment.id).toEqual(payload.id);
    expect(existingThreadComment.username).toEqual(payload.username);
    expect(existingThreadComment.date).toEqual(payload.date);
    expect(existingThreadComment.thread).toEqual(payload.thread);
    expect(existingThreadComment.owner).toEqual(payload.owner);
    expect(existingThreadComment.content).toEqual(payload.content);
    expect(existingThreadComment.likeCount).toEqual(payload.likeCount);
    expect(existingThreadComment.replies).toHaveLength(0);
  });
});
