const db = require("../../../data/dbConfig");
const Users = require('../usersModel');

const usersModelTesting = endpoint => {

    describe('Users model', () => {

        beforeEach(async () => {
            await db('users')
                .delete() 
        });

        // test 1
        test('returns all users in the "users" table', async () => { 
            let usersNumber;
            usersNumber = await Users.find();
            expect(usersNumber).toHaveLength(0);         
            await Users.add({                
                okta_uid: 111, 
                email: 'edmadrigal@yahoo.com', 
                twitter_handle: '@edmadrigal'
            });
            await Users.add({                
                okta_uid: 222, 
                email: 'user1@email.com', 
                twitter_handle: '@user1'
            });
            await Users.add({                
                okta_uid: 333, 
                email: 'user2@email.com', 
                twitter_handle: '@user2'
            });
            await Users.add({                
                okta_uid: 444, 
                email: 'user3@email.com', 
                twitter_handle: '@user3'
            });         
            usersNumber = await Users.find();
            expect(usersNumber).toHaveLength(4);               
        });

        // test 2
        test('returns 1 row using okta_uid', async () => {
            let usersNumber;
            usersNumber = await Users.find();
            expect(usersNumber).toHaveLength(0);         
            await Users.add({                
                okta_uid: 111, 
                email: 'edmadrigal@yahoo.com', 
                twitter_handle: '@edmadrigal'
            });                
            usersNumber = await Users.findBy({ okta_uid: 111 });
            expect(usersNumber).toHaveLength(1);               
        });

        // test 3
        test('adds a new user', async () => {
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
        });

        // test 4: ref to findByOktaUID is not found in userRouter.js
        
        // test 5
        

    })
};
usersModelTesting();