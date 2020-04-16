// const db = require("../../../data/db.config");
// const users = require('./users-model');


//users model testing for add() 

// describe('insert function', () => {
//     it('inserts a new topic into the db', async () => {
//        await db('users').truncate();
//         let usersLength;
//         usersLength = await db('users');
//         expect(usersLength).toHaveLength(0);

//         await users.add({
//             id: 1,
//             title: "New Topic1",
//             user_id: 1,
//             cards: []
//         })

//         usersLength = await db('users');
//         expect(usersLength).toHaveLength(1);

//         await Users.add({
//             id: 2,
//             title: "New Topic 2",
//             user_id: 1,
//             cards: []
//         })

//         usersLength = await db('users');
//         expect(usersLength).toHaveLength(2);

//         await users.remove(2)

//         usersLength = await db('users');
//         expect(usersLength).toHaveLength(1);

//     });
// });