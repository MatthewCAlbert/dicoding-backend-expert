const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');

describe('DeleteThreadCommentReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx',
      userId: 'user-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkOneById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockThreadRepository.checkOneCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.commentId));
    mockThreadRepository.checkOneCommentReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockThreadRepository.checkCommentReplyOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteOneCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadCommentReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkOneById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkOneCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.checkOneCommentReplyById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.checkCommentReplyOwnership).toBeCalledWith(useCasePayload.id, useCasePayload.userId);
    expect(mockThreadRepository.deleteOneCommentReply).toBeCalledWith(useCasePayload.id);
  });
});
