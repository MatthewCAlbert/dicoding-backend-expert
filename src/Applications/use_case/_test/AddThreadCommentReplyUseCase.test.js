const NewThreadCommentReply = require('../../../Domains/threads/entities/NewThreadCommentReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentReplyUseCase = require('../AddThreadCommentReplyUseCase');

describe('AddThreadCommentReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-xxx',
      comment: 'comment-xxx',
      owner: 'user-xxx',
      content: 'Isi konten',
    };
    const expectedThreadResult = {
      ...useCasePayload, createdAt: '', updatedAt: '', deletedAt: '', id: 'reply-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkOneById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockThreadRepository.checkOneCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.comment));
    mockThreadRepository.addOneCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        thread: 'thread-xxx',
        comment: 'comment-xxx',
        owner: 'user-xxx',
        content: 'Isi konten',
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        id: 'reply-xxx',
      }));

    /** creating use case instance */
    const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThreadCommentReply = await addThreadCommentReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedThreadCommentReply).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.addOneCommentReply)
      .toBeCalledWith(new NewThreadCommentReply(useCasePayload));
    expect(mockThreadRepository.checkOneById).toBeCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.checkOneCommentById).toBeCalledWith(useCasePayload.comment);
  });
});
