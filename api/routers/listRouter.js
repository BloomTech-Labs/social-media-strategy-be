const express = require("express");
const schedule = require("node-schedule");
const Lists = require("../models/listModel.js");
const Posts = require("../models/postsModel.js");
const router = express.Router();
const verifyTwitter = require("../middleware/verifyTwitter");

// GET /api/lists
// Returns all lists belonging to logged in user
router.get("/", async (req, res) => {
	Lists.findBy({ okta_uid: req.jwt.claims.uid })
		.then((lists) => {
			res.status(200).json(lists);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json(err);
		});
});

// GET /api/lists/:id
// Returns list by id belonging to logged in user
router.get("/:id", async (req, res, next) => {
	const { id } = req.params;

	Lists.findBy({ okta_uid: req.jwt.claims.uid, id })
		.then(([list]) => {
			if (!list) return next({ code: 404, message: "List not found" });
			res.status(200).json(list);
		})
		.catch((err) => {
			next({ code: 500, message: "There was a problem retrieving the list" });
		});
});

// GET /api/lists/:id/posts
// Returns posts by list id belonging to logged in user
router.get("/:id/posts", (req, res) => {
	Posts.findBy({ okta_uid: req.jwt.claims.uid, list_id: req.params.id })
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// POST /api/lists
// Creates a new list belonging to logged in user
// Returns the new list
router.post("/", async (req, res, next) => {
	const okta_uid = req.jwt.claims.uid;
	const currentLists = await Lists.findBy({ okta_uid });
	const { title } = req.body;

	if (!title) return next({ code: 400, message: "Please provide a title" });

	const newList = {
		title,
		okta_uid,
		index: currentLists.length,
	};

	Lists.add(newList)
		.then((list) => {
			res.status(201).json(list);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// POST /api/lists/:id/posts
// Creates a new post for the list with :id belonging to logged in user
// Returns the new post
router.post("/:id/posts", async (req, res, next) => {
	const okta_uid = req.jwt.claims.uid;
	const list_id = req.params.id;

	const [list] = await Lists.findBy({ okta_uid, id: list_id });
	if (!list) return next({ code: 404, message: "List not found" });

	const currentPosts = await Posts.findBy({ okta_uid, list_id });
	const { post_text } = req.body;

	if (!post_text)
		return next({ code: 400, message: "Please provide text for your post" });

	const newPost = {
		post_text,
		list_id,
		okta_uid,
		index: currentPosts.length,
	};

	Posts.add(newPost)
		.then((post) => {
			res.status(201).json(post);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json(err);
		});
});

// PUT /api/lists/:id
// Updates list with :id belonging to logged in user
// Returns the updated list
router.put("/:id", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;
	const changes = req.body;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	Lists.update(changes, id, okta_uid)
		.then((updated) => {
			res.status(200).json(updated);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// PATCH /api/lists/:id
// Updates list with :id belonging to logged in user
// Returns the updated list
router.patch("/:id", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;
	const changes = req.body;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	Lists.update(changes, id, okta_uid)
		.then((updated) => {
			res.status(200).json(updated);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// DELETE /api/lists/:id
// Deletes list with :id belonging to logged in user
// Returns deleted count
router.delete("/:id", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	Lists.remove(id, req.jwt.claims.uid)
		.then((deleted) => {
			res.status(200).json({ deleted });
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// GET /api/lists/schedule
// Returns next schedule
router.get("/schedule", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const schedule = await Lists.getSchedule(id, okta_uid);

	res.json(schedule);
});

// GET /api/lists/:id/schedule
// Returns all schedules from a list
router.get("/:id/schedule", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const schedule = await Lists.getSchedule(id, okta_uid);

	res.json(schedule);
});

// POST /api/lists/:id/schedule
// Add new schedule to a list
// Expects body = {weekday, hour, minute}
// Returns the new scheduled added
router.post("/:id/schedule", verifyTwitter, async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	const { weekday, hour, minute } = req.body;

	if (
		typeof weekday === "undefined" ||
		typeof hour === "undefined" ||
		typeof minute === "undefined"
	) {
		return next({ code: 400, massege: "Missing required field" });
	}

	const schedule = await Lists.addSchedule({
		list_id: id,
		okta_uid,
		weekday,
		hour,
		minute,
	});

	// schedule cron job with node-schedule
	schedule.scheduleJob(
		schedule.id,
		{
			dayOfWeek: schedule.weekday,
			hour: schedule.hour,
			minute: schedule.minute,
		},
		async () => {
			if (process.env.NODE_ENV !== "testing") {
				// Look for the post in the list with the index = 0
				const [post] = await Posts.findBy({
					okta_uid,
					list_id: schedule.list_id,
					index: 0,
				});

				if (post) {
					req.twit
						.post("statuses/update", {
							status: post.post_text,
						})
						.then(async () => {
							await Posts.update(post.id, { posted: true }, okta_uid);
						})
						.catch((err) => {
							console.error(err);
						});
				}
			}
		},
	);

	res.json(schedule);
});

// DELETE /api/lists/:id/schedule/:schedule_id
// Delete a specific schedule
// Returns delete count
router.delete("/:id/schedule/:schedule_id", async (req, res, next) => {
	const { id, schedule_id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const [count] = await Lists.removeSchedule(schedule_id, id, okta_uid);

	res.json({ count });
});

module.exports = router;
