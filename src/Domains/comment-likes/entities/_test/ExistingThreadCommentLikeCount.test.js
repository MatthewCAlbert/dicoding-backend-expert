const ExistingThreadCommentLikeCount = require('../ExistingThreadCommentLikeCount');

describe('ExistingThreadCommentLikeCount entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
    };

    // Action & Assert
    expect(() => new ExistingThreadCommentLikeCount(payload)).toThrowError('EXISTING_THREAD_COMMENT_LIKE_COUNT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
      likes: 'aaa',
    };

    // Action & Assert
    expect(() => new ExistingThreadCommentLikeCount(payload)).toThrowError('EXISTING_THREAD_COMMENT_LIKE_COUNT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ExistingThreadCommentLikeCount entities correctly', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
      likes: 1,
    };

    // Action
    const existingThreadCommentLikeCount = new ExistingThreadCommentLikeCount(payload);

    // Assert
    expect(existingThreadCommentLikeCount).toBeInstanceOf(ExistingThreadCommentLikeCount);
    expect(existingThreadCommentLikeCount.comment).toEqual(payload.comment);
    expect(existingThreadCommentLikeCount.likes).toEqual(payload.likes);
  });
});
