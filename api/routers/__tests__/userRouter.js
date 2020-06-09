const db = require("../../../data/dbConfig");
const Users = require("../../models/usersModel");
const userRouter = require('../userRouter');
const server = require('../../server');
const supertest = require('supertest');
const request = supertest(server);
const verifyUserId = require("./verifyUserId");

const userRouterTesting = endpoint => {
    describe('Users model', () => {

        beforeEach(async () => {
            await db('users')
                .delete() 
        });

        // test for general test functionality
        test('true to be true', () => {
            expect(true).toBe(true);
        });

        test('true to NOT be false', () => {
            expect(true).not.toBe(false);
        });

        test('finds /api endpoint', async () => {
            const res = await request.get('/api');
            expect(res.status).toBe(200);
        });

        // test 1
        test('adds a user and finds endpoint: /api/111', async () => { 
            let usersNumber;
            usersNumber = await Users.find();
            expect(usersNumber).toHaveLength(0);         
            await Users.add({                
                okta_uid: 111, 
                email: 'edmadrigal@yahoo.com', 
                twitter_handle: '@edmadrigal'
            });         
            usersNumber = await Users.find();
            expect(usersNumber).toHaveLength(1);
            let uidRoute;
            uidRoute = await userRouter.use('/111', verifyUserId);             
        });

    });
};

userRouterTesting();