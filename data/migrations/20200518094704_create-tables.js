exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("id");
      tbl.text("email").notNullable().unique();
      tbl.text("password").notNullable();
      tbl.text("okta_userid").notNullable();
      tbl.text("role");
    })
    .createTable("topics", (tbl) => {
      tbl.text("id").primary();

      tbl.text("title", 64).notNullable();

      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl.specificType("cards", "text ARRAY").defaultTo("{}");

      tbl.integer("index");
    })
    .createTable("platforms", (tbl) => {
      tbl.increments("id");

      tbl.text("platform", 64);
      tbl
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      // tbl.text('okta_userid').notNullable();
    })
    .createTable("posts", (tbl) => {
      tbl.text("id").primary();

      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl
        .integer("platform_id")
        .unsigned()
        .references("id")
        .inTable("platforms")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl
        .text("post_text", 280) //280 for Twitter, will change for future platforms
        .notNullable();

      tbl
        .boolean("completed") // .notNullable()
        .defaultsTo(false);

      tbl.text("date");
      tbl.text("tz");
      // tbl.integer('topic_id').unsigned().references('id').inTable('topics').onUpdate('CASCADE').onDelete('CASCADE');
      tbl.text("optimal_time");
      tbl.text("post_score");
      tbl.text("screenname");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("topics")
    .dropTableIfExists("platforms")
    .dropTableIfExists("posts");
};
