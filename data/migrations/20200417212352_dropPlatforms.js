exports.up = function (knex) {
  return knex.schema
    .alterTable('posts', (tbl) => {
      tbl.dropColumn('platform_id');
    })
    .dropTableIfExists('platforms');
};

exports.down = function (knex) {
  return knex.schema
    .createTable('platforms', (tbl) => {
      tbl.increments('id');

      tbl.text('platform', 64);
      tbl
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .alterTable('posts', (tbl) => {
      tbl
        .integer('platform_id').unsigned().references('id').inTable('platforms').onUpdate('CASCADE') .onDelete('CASCADE');
    });
};
