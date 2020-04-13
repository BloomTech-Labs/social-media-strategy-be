exports.up = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.renameColumn("name", "title");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("topics", (tbl) => {
    tbl.renameColumn("title", "name");
  });
};
