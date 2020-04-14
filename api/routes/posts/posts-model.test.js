const db = require("../../../data/db.config");
const Posts = require('./posts-model');



//Posts model testing for add() 
describe('insert post model function', () => {
    it('inserts a new post into the db', async () => {
        await db('posts').truncate();
        let postsLength;
        postsLength = await db('posts');
        expect(postsLength).toHaveLength(0);

        await Posts.add({
            id: 3,
            user_id: 1,
            platform_id: 1,
            post_text: "Hello Mars!",
            completed: false,
            date: null,
            tz: null,
            optimal_time: null,
            post_score: null
        })

        postsLength = await db('posts');

        expect(postsLength).toHaveLength(1);


        await Posts.add({
            id: 4,
            user_id: 1,
            platform_id: 1,
            post_text: "Hello Saturn!",
            completed: false,
            date: null,
            tz: null,
            optimal_time: null,
            post_score: null
        })

        postsLength = await db('posts');
        expect(postsLength).toHaveLength(2);

    });
});