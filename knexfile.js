// Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    // connection: process.env.DATABASE_URL,
    connection: {
      user: 'jrivera6869',
      password: 'postgres',
      database: 'ebdb',
      host: 'aa1xxezbq1ezyd0.cst1ktu0kueb.us-east-1.rds.amazonaws.com',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },

  testing: {
    client: 'pg',
    connection: process.env.DATABASE_URL,

    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    // connection: process.env.DATABASE_URL,
    connection: {
      user: 'jrivera6869',
      password: 'postgres',
      database: 'ebdb',
      host: 'aa1xxezbq1ezyd0.cst1ktu0kueb.us-east-1.rds.amazonaws.com',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './data/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
};
