exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments("id");
    tbl.text("email").notNullable().unique();
    tbl.text("password").notNullable();
    tbl.text("okta_userid").notNullable();
    tbl.text("role");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
