exports.up = function(knex) {
  return knex.schema.createTable('platforms', tbl => {
    tbl.increments('id');

    tbl.text('platform', 64).notNullable();

    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    // tbl.text('oauth_cred')
    // .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('platforms');
};
