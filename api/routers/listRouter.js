const express = require("express");
const schedule = require("node-schedule");
const Lists = require("../models/listModel.js");
const Posts = require("../models/postsModel.js");
const router = express.Router();
const verifyTwitter = require("../middleware/verifyTwitter");
var moment = require("moment-timezone");
moment().tz("America/Los_Angeles").format();

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
		index: currentPosts.filter((post) => post.index !== null).length,
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

// GET /api/lists/:id/schedule
// Returns all weekly schedules of a list
router.get("/:id/schedule", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	const scheduleList = await Lists.getSchedule(id, okta_uid);

	// create cron jobs in case server restarted
	scheduleList.forEach((current) => {
		const scheduledJob = schedule.scheduledJobs[current.id];

		if (!scheduledJob) {
			// schedule cron job with node-schedule
			schedule.scheduleJob(
				current.id,
				{
					dayOfWeek: current.weekday,
					hour: current.hour,
					minute: current.minute,
				},
				async () => {
					if (process.env.NODE_ENV !== "testing") {
						// Look for the post in the list with the index = 0
						const [post] = await Posts.findBy({
							okta_uid,
							list_id: current.list_id,
							index: 0,
						});

						if (post) {
							req.twit
								.post("statuses/update", {
									status: post.post_text,
								})
								.then(async () => {
									await Posts.update(post.id, { posted: true, index: null }, okta_uid);

									const postsToUpdate = await Posts.findBy({
										list_id: post.list_id,
										posted: false,
									});
									postsToUpdate.map(async (e) => {
										await Posts.update(e.id, { index: e.index - 1 }, okta_uid);
									});
								})
								.catch((err) => {
									console.error(err);
								});
						}
					}
				},
			);
		}
	});

	res.json(scheduleList);
});

// GET /api/lists/:id/schedule/:posts
// Returns next schedule(s) from a list
router.get("/:id/schedule/:posts", async (req, res, next) => {
	const { id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const [list] = await Lists.findBy({ okta_uid, id });
	if (!list) return next({ code: 404, message: "List not found" });

	const scheduleList = await Lists.getSchedule(id, okta_uid);

	const result = [];

	if (scheduleList.length > 0) {
		// Sort schedule list based on todays date
		const sortedSchedule = scheduleList.sort((a, b) => {
			const date1 = schedule.scheduledJobs[a.id].nextInvocation();
			const date2 = schedule.scheduledJobs[b.id].nextInvocation();

			if (date1 < date2) {
				return -1;
			}

			return 1;
		});

		const { posts } = req.params;

		// get the total number of posts/schedule dates requested. If none sets to 1
		const total = posts ? parseInt(posts) : 1;

		for (let i = 0; i < total; i++) {
			// Rotate array at end of for loop. First element is always going to be the next schedule
			const nextSchedule = sortedSchedule[0];

			const scheduledJob = schedule.scheduledJobs[nextSchedule.id];

			// get next invocation for that job from today
			let nextDate = moment(new Date(scheduledJob.nextInvocation())).format();

			// get the number of iterations in the whole schedule array
			const iteration = Math.floor(i / sortedSchedule.length);

			// get next invocation date taking in consideration the iterations
			if (iteration > 0) {
				nextDate = moment(nextDate).add(iteration, "weeks").format();
			}

			result.push({
				...nextSchedule,
				date: nextDate,
			});

			// remove first element in the array
			const removed = sortedSchedule.shift();
			// add same element to the end of the array
			sortedSchedule.push(removed);
		}
	}

	res.json(result);
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

	const newSchedule = await Lists.addSchedule({
		list_id: id,
		okta_uid,
		weekday,
		hour,
		minute,
	});

	// schedule cron job with node-schedule
	schedule.scheduleJob(
		newSchedule.id,
		{
			dayOfWeek: newSchedule.weekday,
			hour: newSchedule.hour,
			minute: newSchedule.minute,
		},
		async () => {
			if (process.env.NODE_ENV !== "testing") {
				// Look for the post in the list with the index = 0
				const [post] = await Posts.findBy({
					okta_uid,
					list_id: newSchedule.list_id,
					posted: false,
					index: 0,
				});

				if (post) {
					req.twit
						.post("statuses/update", {
							status: post.post_text,
						})
						.then(async () => {
							await Posts.update(post.id, { posted: true, index: null }, okta_uid);

							const postsToUpdate = await Posts.findBy({
								list_id: id,
								posted: false,
							});

							postsToUpdate.map(async (current) => {
								if (current.index !== null) {
									await Posts.update(current.id, { index: current.index - 1 }, okta_uid);
								}
							});
						})
						.catch((err) => {
							console.error(err);
						});
				}
			}
		},
	);

	res.json(newSchedule);
});

// DELETE /api/lists/:id/schedule/:schedule_id
// Delete a specific schedule
// Returns delete count
router.delete("/:id/schedule/:schedule_id", async (req, res, next) => {
	const { id, schedule_id } = req.params;
	const okta_uid = req.jwt.claims.uid;

	const scheduledJob = schedule.scheduledJobs[schedule_id];

	if (scheduledJob) {
		// cancel existing job
		scheduledJob.cancel();
	}

	const [count] = await Lists.removeSchedule(schedule_id, id, okta_uid);

	res.json({ count });
});

module.exports = router;
