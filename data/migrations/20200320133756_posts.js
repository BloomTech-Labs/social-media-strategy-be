exports.up = function(knex) {
  return knex.schema.createTable('posts', tbl => {
    tbl.increments('id');

    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    tbl
      .integer('platform_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('platforms')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    tbl
      .text('post_text', 280) //280 for Twitter, will change for future platforms
      .notNullable();

    tbl
      .boolean('completed')
      // .notNullable()
      .defaultsTo(false);

    tbl
      .datetime('datestamp')
      // .notNullable()
      .defaultsTo(knex.fn.now(6));

    tbl
      .integer('topic_id')
      .unsigned()
      .references('id')
      .inTable('topics')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');


      tbl
      .text('optimal_time'); 

      tbl
      .text('post_score'); 
      

  });


  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts');
};
