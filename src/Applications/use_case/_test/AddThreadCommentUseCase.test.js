const NewThreadComment = require('../../../Domains/threads/entities/NewThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-xxx',
      owner: 'user-xxx',
      content: 'Isi konten',
    };
    const expectedThreadResult = {
      ...useCasePayload, createdAt: '', updatedAt: '', deletedAt: '', id: 'comment-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkOneById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockThreadRepository.addOneComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));

    /** creating use case instance */
    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.addOneComment).toBeCalledWith(new NewThreadComment(useCasePayload));
    expect(mockThreadRepository.checkOneById).toBeCalledWith(useCasePayload.thread);
  });
});
