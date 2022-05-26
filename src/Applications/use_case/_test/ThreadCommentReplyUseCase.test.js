const NewThreadCommentReply = require('../../../Domains/replies/entities/NewThreadCommentReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadCommentReplyUseCase = require('../ThreadCommentReplyUseCase');

describe('ThreadCommentReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread comment reply action correctly', async () => {
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
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.thread));
    mockCommentRepository.checkAvailibilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.comment));
    mockReplyRepository.addCommentReply = jest.fn()
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
    const threadCommentReplyUseCase = new ThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedThreadCommentReply = await threadCommentReplyUseCase.addCommentReply(useCasePayload);

    // Assert
    expect(addedThreadCommentReply).toStrictEqual(expectedThreadResult);
    expect(mockReplyRepository.addCommentReply)
      .toBeCalledWith(new NewThreadCommentReply(useCasePayload));
    expect(mockThreadRepository.checkAvailibilityThreadById)
      .toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailibilityCommentById)
      .toBeCalledWith(useCasePayload.comment);
  });

  it('should orchestrating the delete thread comment reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-xxx',
      commentId: 'comment-xxx',
      threadId: 'thread-xxx',
      userId: 'user-xxx',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailibilityThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockCommentRepository.checkAvailibilityCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.commentId));
    mockReplyRepository.checkAvailibilityReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.id));
    mockReplyRepository.checkCommentReplyOwnership = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const threadCommentReplyUseCase = new ThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await threadCommentReplyUseCase.deleteCommentReply(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailibilityThreadById)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkAvailibilityCommentById)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.checkAvailibilityReplyById)
      .toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.checkCommentReplyOwnership)
      .toBeCalledWith(useCasePayload.id, useCasePayload.userId);
    expect(mockReplyRepository.deleteCommentReply)
      .toBeCalledWith(useCasePayload.id);
  });
});
