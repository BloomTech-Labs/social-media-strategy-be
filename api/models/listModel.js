const db = require("../../data/dbConfig");
var knex = require("knex");

module.exports = {
	add,
	get,
	findBy,
	remove,
	update,
	getSchedule,
	addSchedule,
	removeSchedule,
};

function get() {
	return db("lists");
}

async function add(list) {
	let [addlist] = await db("lists").insert(list, "*");
	return addlist;
}

async function findBy(filter) {
	return db("lists").where(filter);
}

function remove(id, okta_uid) {
	return db("lists").where({ id, okta_uid }).del();
}

async function update(update, id, okta_uid) {
	const [updated] = await db("lists")
		.where({ id, okta_uid })
		.update(update, "*");
	return updated;
}

function getSchedule(id, okta_uid) {
	return db("list_schedule").where({ list_id: id, okta_uid });
}

async function addSchedule(schedule) {
	let [addSchedule] = await db("list_schedule").insert(schedule, "*");
	return addSchedule;
}

async function removeSchedule(schedule_id, list_id, okta_uid) {
	return db("list_schedule").where({ id: schedule_id, list_id, okta_uid }).del();
}
