exports.up = function (knex) {
    return knex.schema.alterTable("users", (tbl) => {
      tbl.text("role");
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable("users", (tbl) => {
      tbl.dropColumn("role");
    });
  };
  