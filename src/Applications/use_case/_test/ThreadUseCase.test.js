const NewThread = require('../../../Domains/threads/entities/NewThread');
const ExistingThread = require('../../../Domains/threads/entities/ExistingThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment-likes/CommentLikeRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Judul',
      owner: 'user-xxx',
      body: 'Isi konten',
    };
    const expectedThreadResult = new ExistingThread({
      ...useCasePayload, createdAt: '', updatedAt: '', id: 'thread-xxx',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload));
  });

  it('should orchestrating get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-xxx',
    };
    const expectedThreadResult = new ExistingThread({
      ...useCasePayload, comments: [], body: 'ini body', owner: 'user-xxx', title: 'Judul',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));
    mockCommentLikeRepository.getCommentLikesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const retrievedThread = await threadUseCase.getThreadDetail(useCasePayload);

    // Assert
    expect(retrievedThread).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
  });
});
