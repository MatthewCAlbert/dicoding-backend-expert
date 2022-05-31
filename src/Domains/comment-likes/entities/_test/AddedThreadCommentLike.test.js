const AddedThreadCommentLike = require('../AddedThreadCommentLike');

describe('AddedThreadCommentLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-xxx',
    };

    // Action & Assert
    expect(() => new AddedThreadCommentLike(payload)).toThrowError('ADDED_THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-like-xxx',
      comment: 'comment-xxx',
      owner: 312312,
    };

    // Action & Assert
    expect(() => new AddedThreadCommentLike(payload)).toThrowError('ADDED_THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThreadCommentLike entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-like-xxx',
      comment: 'comment-xxx',
      owner: 'user-xxxx',
    };

    // Action
    const addedThreadCommentLike = new AddedThreadCommentLike(payload);

    // Assert
    expect(addedThreadCommentLike).toBeInstanceOf(AddedThreadCommentLike);
    expect(addedThreadCommentLike.id).toEqual(payload.id);
    expect(addedThreadCommentLike.comment).toEqual(payload.comment);
    expect(addedThreadCommentLike.owner).toEqual(payload.owner);
  });
});
