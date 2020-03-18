exports.up = function (knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments('id');
    tbl
      .text('email')
      .notNullable()
      .unique();
    tbl.text('password').notNullable();
  })
    .createTable('platforms', tbl => {
      tbl.increments('id');

      tbl.text('platform', 64)
      .notNullable();

      tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      // tbl.text('oauth_cred')
      // .notNullable();
    })

    .createTable('topics', tbl => {
      tbl.increments('id');

      tbl.text('name', 64)
      .notNullable();

      tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');


    })


    .createTable('posts', tbl => {
      tbl.increments('id');

      tbl.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl.integer('platform_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('platforms')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl.text('post_text', 280)  //280 for Twitter, will change for future platforms
        .notNullable();

      tbl.boolean('completed')
        .notNullable();

      tbl.datetime('datestamp')
        .notNullable();

      tbl.integer('topic_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('topics')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');


    })




};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('topics')
    .dropTableIfExists('platforms')
    .dropTableIfExists('users');
};
