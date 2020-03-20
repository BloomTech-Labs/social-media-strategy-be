exports.up = function(knex) {
  return knex.schema.createTable('topics', tbl => {
    tbl.increments('id');

    tbl.text('name', 64).notNullable();

    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('topics');
};
