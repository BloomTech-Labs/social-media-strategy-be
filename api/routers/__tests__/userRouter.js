const userRouter = require('../userRouter');

const userRouterTesting = endpoint => {
    // test for general functionality
    test('true to be true', () => {
        expect(true).toBe(true);
    })
};

userRouterTesting();