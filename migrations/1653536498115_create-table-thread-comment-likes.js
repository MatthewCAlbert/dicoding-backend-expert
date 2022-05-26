/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
