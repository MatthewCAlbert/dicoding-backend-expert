const AddedThreadCommentReply = require('../AddedThreadCommentReply');

describe('AddedThreadCommentReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      thread: 'thread-xxx',
    };

    // Action & Assert
    expect(() => new AddedThreadCommentReply(payload)).toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-xxx',
      comment: 'comment-xxx',
      owner: 312312,
      content: 'Isi Badan',
    };

    // Action & Assert
    expect(() => new AddedThreadCommentReply(payload)).toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThreadCommentReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-xxx',
      comment: 'comment-xxx',
      owner: 'user-xxxx',
      content: 'Isi Badan',
    };

    // Action
    const addedThreadCommentReply = new AddedThreadCommentReply(payload);

    // Assert
    expect(addedThreadCommentReply).toBeInstanceOf(AddedThreadCommentReply);
    expect(addedThreadCommentReply.id).toEqual(payload.id);
    expect(addedThreadCommentReply.comment).toEqual(payload.comment);
    expect(addedThreadCommentReply.owner).toEqual(payload.owner);
    expect(addedThreadCommentReply.content).toEqual(payload.content);
  });
});
