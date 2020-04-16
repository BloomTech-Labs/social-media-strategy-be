const db = require("../../../data/db.config");
const Topics = require('./topics-model');


//Topics model testing for add() 

describe('insert function', () => {
    it('inserts a new topic into the db', async () => {
       await db('topics').truncate();
        let topicsLength;
        topicsLength = await db('topics');
        expect(topicsLength).toHaveLength(0);

        await Topics.add({
            id: 1,
            title: "New Topic1",
            user_id: 1,
            cards: []
        })

        topicsLength = await db('topics');
        expect(topicsLength).toHaveLength(1);

        await Topics.add({
            id: 2,
            title: "New Topic 2",
            user_id: 1,
            cards: []
        })

        topicsLength = await db('topics');
        expect(topicsLength).toHaveLength(2);

        await Topics.remove(2)

        topicsLength = await db('topics');
        expect(topicsLength).toHaveLength(1);

    });
});