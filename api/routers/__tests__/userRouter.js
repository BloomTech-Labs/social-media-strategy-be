const db = require("../../../data/dbConfig");
const userRouter = require('../userRouter');

const userRouterTesting = endpoint => {
    describe('Users model', () => {

        beforeEach(async () => {
            await db('users')
                .delete() 
        });
        // test for general functionality
        test('true to be true', () => {
            expect(true).toBe(true);
        })
        test('true to NOT be false', () => {
            expect(true).not.toBe(false);
        })
});
};

userRouterTesting();