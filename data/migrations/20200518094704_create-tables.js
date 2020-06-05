exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable("lists", (tbl) => {
      tbl
        .uuid("id")
        .notNullable()
        .unique()
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      tbl.string("okta_uid").notNullable();
      tbl.integer("index").notNullable();
      tbl.string("title").notNullable();
    })
    .createTable("posts", (tbl) => {
      tbl
        .uuid("id")
        .notNullable()
        .unique()
        .primary()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      tbl.string("okta_uid").notNullable();
      tbl
        .uuid("list_id")
        .notNullable()
        .references("lists.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.integer("date").notNullable();
      tbl.integer("index").notNullable();
      tbl.text("post_score");
      tbl.text("post_text");
      tbl.boolean("posted").notNullable().defaultsTo(false);
      tbl.integer("optimal_time");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("posts")
    .dropTableIfExists("lists")
    .dropTableIfExists("users");
};
