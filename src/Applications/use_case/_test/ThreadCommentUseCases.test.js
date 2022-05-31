const NewThreadComment = require('../../../Domains/comments/entities/NewThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadCommentUseCases = require('../ThreadCommentUseCases');

describe('ThreadCommentUseCases', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread comment action correctly', async () => {
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
    const threadCommentUseCases = new ThreadCommentUseCases({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedThreadComment = await threadCommentUseCases.addThreadComment(useCasePayload);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedThreadResult);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewThreadComment(useCasePayload));
    expect(mockThreadRepository.checkAvailibilityThreadById).toBeCalledWith(useCasePayload.thread);
  });

  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-xxx',
      threadId: 'thread-xxx',
      userId: 'user-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockCommentRepository.checkAvailibilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockCommentRepository.checkCommentOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const threadCommentUseCases = new ThreadCommentUseCases({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await threadCommentUseCases.deleteThreadComment(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailibilityThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailibilityCommentById)
      .toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.checkCommentOwnership)
      .toBeCalledWith(useCasePayload.id, useCasePayload.userId);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.id);
  });
});
