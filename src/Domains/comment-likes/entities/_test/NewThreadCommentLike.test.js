const NewThreadCommentLike = require('../NewThreadCommentLike');

describe('NewThreadCommentLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
    };

    // Action & Assert
    expect(() => new NewThreadCommentLike(payload)).toThrowError('NEW_THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
      owner: 312312,
    };

    // Action & Assert
    expect(() => new NewThreadCommentLike(payload)).toThrowError('NEW_THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadCommentLike entities correctly', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
      owner: 'user-xxxx',
    };

    // Action
    const newThreadCommentLike = new NewThreadCommentLike(payload);

    // Assert
    expect(newThreadCommentLike).toBeInstanceOf(NewThreadCommentLike);
    expect(newThreadCommentLike.comment).toEqual(payload.comment);
    expect(newThreadCommentLike.owner).toEqual(payload.owner);
  });
});
