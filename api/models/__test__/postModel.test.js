const server = require('../../server');
const request = require('supertest');
const db = require('../../../data/dbConfig');
const Posts = require('../postsModel');

const postModelTesting = () => {

    describe('GET /', () => { 

        it('has process.env.NODE_ENV as "testing"', () => {
            expect(process.env.NODE_ENV).toBe('testing');
        });

        it('returns 200 OK', () => {
            return request(server).get('/')
                .expect(200)
        });

    });

    describe('GET available posts', () => {

        beforeEach(async() => {
            await db('posts')
                .delete()
        });

        test('returns 0 posts', async () => {
            let postTotal;
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(0);
        })

        test('returns 1 post', async () => {
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(0);
            await Posts.add({
                id: 1,
                okta_uid: "okta_uid_1",
                index: 1,
                list_id: 1,
                post_text: "post text 1"
            });
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(1);
        });

        test('removes post with id: 2', async () => {
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(0);
            await Posts.add({
                id: 1,
                okta_uid: "okta_uid_1",
                index: 1,
                list_id: 1,
                post_text: "post text 1"
            });
            await Posts.add({
                id: 2,
                okta_uid: "okta_uid_2",
                index: 2,
                list_id: 2,
                post_text: "post text 2"
            });
            await Posts.add({
                id: 3,
                okta_uid: "okta_uid_3",
                index: 3,
                list_id: 3,
                post_text: "post text 3"
            });
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(3);
            await Posts.remove(2, "okta_uid_2");
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(2);
        });

        test('updates post with id: 2', async () => {
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(0);
            await Posts.add({
                id: 1,
                okta_uid: "okta_uid_1",
                index: 1,
                list_id: 1,
                post_text: "post text 1"
            });
            await Posts.add({
                id: 2,
                okta_uid: "okta_uid_2",
                index: 2,
                list_id: 2,
                post_text: "post text 2"
            });
            await Posts.add({
                id: 3,
                okta_uid: "okta_uid_3",
                index: 3,
                list_id: 3,
                post_text: "post text 3"
            });
            await Posts.add({
                id: 4,
                okta_uid: "okta_uid_4",
                index: 4,
                list_id: 4,
                post_text: "post text 4"
            });
            postTotal = await Posts.get();
            expect(postTotal).toHaveLength(4);
            await Posts.update(2, {
                post_text: "New post text 2"
            }, "okta_uid_2");
            let postObject;
            postObject = await Posts.findBy({
                id: 2
            });
            expect(postObject).toHaveLength(1);
            let updateFound;
            updateFound = await Posts.findBy({
                post_text: "New post text 2"
            });
            expect(updateFound).toHaveLength(1);
        });

    })

}

postModelTesting();