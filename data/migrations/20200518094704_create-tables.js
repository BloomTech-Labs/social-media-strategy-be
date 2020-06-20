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
			tbl.timestamp("created_at").defaultTo(knex.fn.now());
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
			tbl.timestamp("created_at").defaultTo(knex.fn.now());
			tbl.integer("index").notNullable();
			tbl.text("post_text");
			tbl.boolean("posted").notNullable().defaultsTo(false);
			tbl.timestamp("optimal_time");
			tbl.timestamp("scheduled_time");
			tbl.string("image_url");
		})
		.createTable("list_schedule", (tbl) => {
			tbl.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
			tbl
				.uuid("list_id")
				.notNullable()
				.references("lists.id")
				.onUpdate("CASCADE")
				.onDelete("CASCADE");
			tbl.string("okta_uid").notNullable();
			tbl.integer("week_day").notNullable();
			tbl.integer("hour").notNullable();
			tbl.integer("minute").notNullable();
		})
		.raw(
			"ALTER TABLE list_schedule ADD CONSTRAINT check_schedule CHECK (week_day >= 0 AND week_day <= 6 AND hour >= 0 AND hour <= 23 AND minute >= 0 AND minute <= 59)",
		);
};

exports.down = function (knex) {
	return knex.schema
		.dropTableIfExists("list_schedule")
		.dropTableIfExists("posts")
		.dropTableIfExists("lists");
};
