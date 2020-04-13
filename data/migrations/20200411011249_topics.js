exports.up = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.specificType("cards", "text ARRAY").defaultTo("{}").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.specificType("cards", "text ARRAY").alter();
  });
};
