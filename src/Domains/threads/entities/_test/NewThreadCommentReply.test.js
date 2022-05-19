const NewThreadCommentReply = require('../NewThreadCommentReply');

describe('NewThreadCommentReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new NewThreadCommentReply(payload)).toThrowError('NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
      comment: 'comment-xxx',
      owner: 312312,
      content: 'Isi Badan',
    };

    // Action & Assert
    expect(() => new NewThreadCommentReply(payload)).toThrowError('NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadCommentReply entities correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
      comment: 'comment-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
    };

    // Action
    const newThreadCommentReply = new NewThreadCommentReply(payload);

    // Assert
    expect(newThreadCommentReply).toBeInstanceOf(NewThreadCommentReply);
    expect(newThreadCommentReply.thread).toEqual(payload.thread);
    expect(newThreadCommentReply.comment).toEqual(payload.comment);
    expect(newThreadCommentReply.owner).toEqual(payload.owner);
    expect(newThreadCommentReply.content).toEqual(payload.content);
  });
});
