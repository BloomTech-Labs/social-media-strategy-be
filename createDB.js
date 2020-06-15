"use strict";

// https://stackoverflow.com/a/49691608/8229853

async function createDatabase() {
  const config = require(process.cwd() + "/knexfile");
  config.connection.database = null;
  const knex = require("knex")(config);

  await knex.raw("CREATE DATABASE some-test");
  await knex.destroy();
}

createDatabase();
