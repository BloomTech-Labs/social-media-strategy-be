exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments('id');
    tbl
      .text('email')
      .notNullable()
      .unique();
    tbl.text('password').notNullable();
    tbl.text('okta_userid').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('topics')
    .dropTableIfExists('platforms')
    .dropTableIfExists('users');
};
