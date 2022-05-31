const ExistingThreadCommentReply = require('../ExistingThreadCommentReply');

describe('ExistingThreadCommentReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
    };

    // Action & Assert
    expect(() => new ExistingThreadCommentReply(payload)).toThrowError('EXISTING_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-xxx',
      username: 'username',
      comment: 'comment-xxx',
      owner: 312312,
      content: 'Isi Badan',
      date: new Date(),
    };

    // Action & Assert
    expect(() => new ExistingThreadCommentReply(payload)).toThrowError('EXISTING_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ExistingThreadCommentReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-xxx',
      username: 'username',
      comment: 'comment-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
      date: new Date(),
      deletedAt: null,
    };

    // Action
    const existingThreadCommentReply = new ExistingThreadCommentReply(payload);

    // Assert
    expect(existingThreadCommentReply).toBeInstanceOf(ExistingThreadCommentReply);
    expect(existingThreadCommentReply.id).toEqual(payload.id);
    expect(existingThreadCommentReply.username).toEqual(payload.username);
    expect(existingThreadCommentReply.date).toEqual(payload.date);
    expect(existingThreadCommentReply.comment).toEqual(payload.comment);
    expect(existingThreadCommentReply.owner).toEqual(payload.owner);
    expect(existingThreadCommentReply.content).toEqual(payload.content);
  });

  it('should create ExistingThreadCommentReply entities when soft deleted correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-xxx',
      username: 'username',
      comment: 'comment-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
      deletedAt: new Date(),
      date: new Date(),
    };

    // Action
    const existingThreadCommentReply = new ExistingThreadCommentReply(payload);

    // Assert
    expect(existingThreadCommentReply).toBeInstanceOf(ExistingThreadCommentReply);
    expect(existingThreadCommentReply.id).toEqual(payload.id);
    expect(existingThreadCommentReply.username).toEqual(payload.username);
    expect(existingThreadCommentReply.date).toEqual(payload.date);
    expect(existingThreadCommentReply.comment).toEqual(payload.comment);
    expect(existingThreadCommentReply.owner).toEqual(payload.owner);
    expect(existingThreadCommentReply.content).toEqual('**balasan telah dihapus**');
  });
});
