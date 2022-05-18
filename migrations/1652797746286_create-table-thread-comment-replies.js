/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'TEXT',
      notNull: true,
    },
    updatedAt: {
      type: 'TEXT',
      notNull: true,
    },
    deletedAt: {
      type: 'TEXT',
      default: null,
    },
  });

  pgm.addConstraint('thread_comment_replies', 'fk_thread_comment_replies.user_id_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('thread_comment_replies', 'fk_thread_comment_replies.reply_id_replies.id', 'FOREIGN KEY(comment) REFERENCES thread_comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comment_replies', 'fk_thread_comment_replies.reply_id_replies.id', { ifExists: true });
  pgm.dropConstraint('thread_comment_replies', 'fk_thread_comment_replies.user_id_users.id', { ifExists: true });

  pgm.dropTable('thread_comment_replies');
};
