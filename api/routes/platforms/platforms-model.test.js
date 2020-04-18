// const db = require("../../../data/db.config");
// const Platforms = require('./platforms-model');

// //platforms model testing for add()
// describe('insert platform model function', () => {
//     it('inserts a new platform into the db', async () => {
//         await db('platforms')
//         let platformsLength;
//         platformsLength = await db('platforms');
//         expect(platformsLength).toHaveLength(1);

//         await Platforms.add({
//             id: 2,
//             platform: "Instagram",
//             user_id: null
//         })

//         platformsLength = await db('platforms');

//         expect(platformsLength).toHaveLength(2);

//         await Platforms.remove(2)

//         platformsLength = await db('platforms');
//         expect(platformsLength).toHaveLength(1);

//     });
// });
