const NewThreadComment = require('../../../Domains/comments/entities/NewThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        thread: 'thread-xxx',
        owner: 'user-xxx',
        content: 'Isi konten',
        createdAt: '',
        updatedAt: '',
        deletedAt: '',
        id: 'comment-xxx',
      }));

    /** creating use case instance */
    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedThreadResult);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewThreadComment(useCasePayload));
    expect(mockThreadRepository.checkAvailibilityThreadById).toBeCalledWith(useCasePayload.thread);
  });
});
