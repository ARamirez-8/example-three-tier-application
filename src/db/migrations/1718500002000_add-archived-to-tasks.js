exports.up = (pgm) => {
  pgm.addColumn('tasks', {
    archived: { type: 'boolean', notNull: true, default: false },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('tasks', 'archived');
};
