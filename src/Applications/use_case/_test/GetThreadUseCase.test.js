const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-xxx'
    };
    const expectedThreadResult = new ExistingThread({
      ...useCasePayload, comments: [], body: 'ini body', owner: 'user-xxx', title: 'Judul',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getOneById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const retrievedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(retrievedThread).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.getOneById).toBeCalledWith(useCasePayload.id);
  });
});
