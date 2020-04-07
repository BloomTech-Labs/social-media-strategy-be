exports.up = function(knex) {
  return knex.schema.createTable('platforms', tbl => {
    tbl.increments('id');

    tbl.text('platform', 64).notNullable();

    tbl
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    // tbl.text('okta_userid').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('platforms');
};
