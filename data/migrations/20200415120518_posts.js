exports.up = function (knex) {
  return knex.schema.alterTable("posts", (tbl) => {
    tbl.text("screenname");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("posts", (tbl) => {
    tbl.dropColumn("screenname");
  });
};
