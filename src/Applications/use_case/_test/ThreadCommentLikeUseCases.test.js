const NewThreadCommentLike = require('../../../Domains/comment-likes/entities/NewThreadCommentLike');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment-likes/CommentLikeRepository');
const ThreadCommentLikeUseCases = require('../ThreadCommentLikeUseCases');

describe('ThreadCommentLikeUseCases', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the toggle on thread comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-xxx',
      userId: 'user-xxx',
      threadId: 'thread-xxx',
    };
    const expectedThreadResult = {
      id: 'comment-like-xxx',
      comment: useCasePayload.id,
      owner: useCasePayload.userId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-xxx'));
    mockCommentRepository.checkAvailibilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve('comment-xxx'));
    mockCommentLikeRepository.findCommentLikeId = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-like-xxx',
        comment: 'comment-xxx',
        owner: 'user-xxx',
      }));

    /** creating use case instance */
    const threadCommentLikeUseCases = new ThreadCommentLikeUseCases({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const addedThreadCommentLike = await threadCommentLikeUseCases
      .toggleThreadCommentLike(useCasePayload);

    // Assert
    expect(addedThreadCommentLike).toStrictEqual(expectedThreadResult);
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(new NewThreadCommentLike({
      comment: useCasePayload.id,
      owner: useCasePayload.userId,
    }));
    expect(mockThreadRepository.checkAvailibilityThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailibilityCommentById)
      .toBeCalledWith(useCasePayload.id);
    expect(mockCommentLikeRepository.findCommentLikeId)
      .toBeCalledWith(useCasePayload.id, useCasePayload.userId);
  });

  it('should orchestrating the toggle off thread comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-xxx',
      userId: 'user-xxx',
      threadId: 'thread-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve('thread-xxx'));
    mockCommentRepository.checkAvailibilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve('comment-xxx'));
    mockCommentLikeRepository.findCommentLikeId = jest.fn()
      .mockImplementation(() => Promise.resolve('comment-like-xxx'));
    mockCommentLikeRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.addCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-like-xxx',
        comment: 'comment-xxx',
        owner: 'user-xxx',
      }));

    /** creating use case instance */
    const threadCommentLikeUseCases = new ThreadCommentLikeUseCases({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await threadCommentLikeUseCases.toggleThreadCommentLike(useCasePayload);

    // Assert
    expect(mockCommentLikeRepository.deleteCommentLike).toBeCalledWith('comment-like-xxx');
    expect(mockThreadRepository.checkAvailibilityThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailibilityCommentById)
      .toBeCalledWith(useCasePayload.id);
    expect(mockCommentLikeRepository.findCommentLikeId)
      .toBeCalledWith(useCasePayload.id, useCasePayload.userId);
  });
});
