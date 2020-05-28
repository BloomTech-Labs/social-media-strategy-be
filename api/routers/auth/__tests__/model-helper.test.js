const db = require("../../../data/dbConfig");
// const Posts = require('../posts/posts-model.js');
const lists = require("../lists/lists-model.js");
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
  find,
  add,
  ModelRemove,
  ModelUpdate,
  findByID,
] = require("../../helper");

const postExample = {
  id: 4,
  user_id: 1,
  post_text: "Hello Saturn!",
  completed: false,
  date: null,
  tz: null,
  optimal_time: null,
  post_score: null,
};

const listExample = {
  id: 1,
  title: "New list1",
  user_id: 1,
  cards: [],
};

const userExample = {
  id: 50,
  email: "hal@hal.com",
  password: "test",
  okta_userid: "12323",
};

const userUpdate = {
  id: 50,
  email: "update@update.com",
  password: "test",
  okta_userid: "12323",
};

const postUpdate = {
  id: 4,
  user_id: 1,
  post_text: "Updated text",
  completed: false,
  date: null,
  tz: null,
  optimal_time: null,
  post_score: null,
  screenname: null,
};

const listUpdate = {
  id: "1",
  title: "Updated list",
  user_id: 1,
  cards: [],
  index: null,
};

function addRemoveTester(table, formattedSubmission) {
  describe("insert function inserts", () => {
    it("inserts a new item into the db", async () => {
      await db(`${table}`).truncate();
      let tableLength;
      tableLength = await db(`${table}`);
      expect(tableLength).toHaveLength(0);

      await add(table, formattedSubmission);

      tableLength = await db(`${table}`);

      expect(tableLength).toHaveLength(1);

      await ModelRemove(table, formattedSubmission.id);

      tableLength = await db(`${table}`);
      expect(tableLength).toHaveLength(0);
    });
  });
}

function updateTester(table, formattedSubmission, formattedUpdate) {
  describe("Updates inserted values for users and posts tables", () => {
    it("inserts a new item into the db", async () => {
      await db(`${table}`).truncate();
      let tableLength;
      tableLength = await db(`${table}`);
      expect(tableLength).toHaveLength(0);

      await add(table, formattedSubmission);

      tableLength = await db(`${table}`);

      expect(tableLength).toHaveLength(1);

      await ModelUpdate(table, formattedUpdate, formattedSubmission.id);

      tableLength = await db(`${table}`);
      //console.log('HEREHEHEHRHERE', tableLength[0]);
      expect(tableLength[0]).toEqual(formattedUpdate);
    });
  });
}

addRemoveTester("posts", postExample);
addRemoveTester("lists", listExample);
updateTester("posts", postExample, postUpdate);
updateTester("lists", listExample, listUpdate);
// modelTester('users', Users, userExample);
