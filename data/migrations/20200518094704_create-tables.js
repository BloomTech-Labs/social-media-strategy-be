exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    .createTable("users", (tbl) => {
      tbl.string("okta_uid")
        .notNullable()
        .unique();
      tbl.string("email")
        .notNullable()
        .unique();
      tbl.string("twitter_handle");
    })

    .createTable("lists", (tbl) => {
      tbl.uuid("id")
        .notNullable()
        .unique()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      tbl
        .string("okta_uid")
        .notNullable()
        .references("users.okta_uid")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.integer("index")
        .notNullable();
      tbl.string("title")
        .notNullable();
    })

    .createTable("posts", (tbl) => {
      tbl.uuid("id")
        .notNullable()
        .unique()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      tbl
        .string("okta_uid")
        .notNullable()
        .references("users.okta_uid")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl
        .uuid("list_id")
        .notNullable()
        .references("lists.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.integer("date")
        .notNullable();
      tbl.integer("index")
        .notNullable();
      tbl.text("post_score");
      tbl.text("post_text");
      tbl.boolean("posted")
        .notNullable()
        .defaultsTo(false);
      tbl.integer("optimal_time");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("posts")
    .dropTableIfExists("lists")
    .dropTableIfExists("users");
};
