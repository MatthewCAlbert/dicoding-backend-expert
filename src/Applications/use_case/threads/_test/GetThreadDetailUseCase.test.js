const ExistingThread = require('../../../../Domains/threads/entities/ExistingThread');
const ExistingThreadComment = require('../../../../Domains/comments/entities/ExistingThreadComment');
const ExistingThreadCommentReply = require('../../../../Domains/replies/entities/ExistingThreadCommentReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../../Domains/comment-likes/CommentLikeRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ExistingThreadCommentLikeCount = require('../../../../Domains/comment-likes/entities/ExistingThreadCommentLikeCount');

describe('GetThreadDetailUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */

  // Samples
  const sample = {
    thread: {
      id: 'thread-xxx',
      body: 'ini body',
      owner: 'user-xxx',
      title: 'Judul',
    },
    rawComments: [
      new ExistingThreadComment({
        id: 'comment-xxx',
        thread: 'thread-xxx',
        username: 'budi',
        owner: 'user-xxx',
        date: new Date('2020-02-10'),
        likeCount: 0,
        deletedAt: null,
        content: 'sampel',
      }),
    ],
    rawReplies: [
      new ExistingThreadCommentReply({
        comment: 'comment-xxx',
        id: 'reply-xxx',
        username: 'budi',
        owner: 'user-xxx',
        date: new Date('2020-02-10'),
        deletedAt: null,
        content: 'sampel',
      }),
    ],
    rawCommentLikes: [
      new ExistingThreadCommentLikeCount({
        comment: 'comment-xxx',
        likes: 1,
      }),
    ],
  };

  it('should orchestrating get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-xxx',
    };
    const expectedThreadResult = {
      ...new ExistingThread({
        ...sample.thread,
        comments: [
          {
            id: 'comment-xxx',
            username: 'budi',
            content: 'sampel',
            date: new Date('2020-02-10'),
            likeCount: 1,
            replies: [
              {
                id: 'reply-xxx',
                username: 'budi',
                date: new Date('2020-02-10'),
                content: 'sampel',
              },
            ],
          },
        ],
      }),
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(sample.rawComments));
    mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(sample.rawReplies));
    mockCommentLikeRepository.getCommentLikesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(sample.rawCommentLikes));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const retrievedThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(retrievedThread).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getCommentRepliesByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockCommentLikeRepository.getCommentLikesByThreadId).toBeCalledWith(useCasePayload.id);
  });

  it('should orchestrating get thread action correctly without like entries given', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-xxx',
    };
    const expectedThreadResult = {
      ...new ExistingThread({
        ...sample.thread,
        comments: [
          {
            id: 'comment-xxx',
            username: 'budi',
            content: 'sampel',
            date: new Date('2020-02-10'),
            likeCount: 0,
            replies: [
              {
                id: 'reply-xxx',
                username: 'budi',
                date: new Date('2020-02-10'),
                content: 'sampel',
              },
            ],
          },
        ],
      }),
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadResult));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(sample.rawComments));
    mockReplyRepository.getCommentRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(sample.rawReplies));
    mockCommentLikeRepository.getCommentLikesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const retrievedThread = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(retrievedThread).toStrictEqual(expectedThreadResult);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getCommentRepliesByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockCommentLikeRepository.getCommentLikesByThreadId).toBeCalledWith(useCasePayload.id);
  });
});
