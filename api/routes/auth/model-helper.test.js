const db = require('../../../data/db.config');
const Posts = require('../posts/posts-model.js');
const Topics = require('../topics/topics-model.js')
const [
  joivalidation,
  joivalidationError,
  lengthcheck,
  postModels,
  find,
  add,
  ModelRemove,
  UserUpdate,
] = require('../../helper');

const postExample = {
    id: 4,
    user_id: 1,
    post_text: 'Hello Saturn!',
    completed: false,
    date: null,
    tz: null,
    optimal_time: null,
    post_score: null,
  }

  const topicExample = {
    id: 1,
    title: "New Topic1",
    user_id: 1,
    cards: []
}

function modelTester(table, model, formattedSubmission){
    describe('insert function inserts', () => {
        it('inserts a new item into the db', async () => {
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

modelTester('posts', Posts, postExample);
modelTester('topics', Topics, topicExample);


