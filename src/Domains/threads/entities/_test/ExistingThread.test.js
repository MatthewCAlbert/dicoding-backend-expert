const ExistingThread = require('../ExistingThread');

describe('ExistingThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'matthew',
    };

    // Action & Assert
    expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-xxx',
      title: 'Judul',
      body: 123,
      owner: 'user-xxxx',
      createdAt: '2022-05-18T18:18:08.714Z',
      comments: 'haiya',
      username: 'matthew'
    };

    // Action & Assert
    expect(() => new ExistingThread(payload)).toThrowError('EXISTING_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ExistingThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-xxx',
      title: 'Judul',
      body: 'Isian',
      owner: 'user-xxxx',
      createdAt: '2022-05-18T18:18:08.714Z',
      comments: [],
      username: 'matthew'
    };

    // Action
    const existingThread = new ExistingThread(payload);

    // Assert
    expect(existingThread).toBeInstanceOf(ExistingThread);
    expect(existingThread.id).toEqual(payload.id);
    expect(existingThread.title).toEqual(payload.title);
    expect(existingThread.body).toEqual(payload.body);
    expect(existingThread.owner).toEqual(payload.owner);
    expect(existingThread.username).toEqual(payload.username);
    expect(existingThread.comments.length).toEqual(0);
    expect(existingThread.date).toEqual(payload.createdAt);
  });
});
