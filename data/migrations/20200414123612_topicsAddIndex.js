exports.up = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.integer("index");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.dropColumn("index");
  });
};
