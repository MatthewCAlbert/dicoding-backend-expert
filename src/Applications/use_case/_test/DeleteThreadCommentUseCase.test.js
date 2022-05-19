const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-xxx',
      threadId: 'thread-xxx',
      userId: 'user-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkOneById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockThreadRepository.checkOneCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockThreadRepository.checkCommentOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteOneComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkOneById).toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.checkOneCommentById).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.checkCommentOwnership).toBeCalledWith(useCasePayload.id, useCasePayload.userId);
    expect(mockThreadRepository.deleteOneComment).toBeCalledWith(useCasePayload.id);
  });
});
