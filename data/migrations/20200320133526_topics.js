exports.up = function (knex) {
  return knex.schema.createTable("topics", (tbl) => {
    tbl.text("id").primary();

    tbl.text("name", 64).notNullable();

    tbl
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    tbl.specificType("cards", "text ARRAY");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("topics");
};
