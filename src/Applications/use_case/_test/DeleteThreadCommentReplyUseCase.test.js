const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');

describe('DeleteThreadCommentReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
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
    const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteThreadCommentReplyUseCase.execute(useCasePayload);

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
