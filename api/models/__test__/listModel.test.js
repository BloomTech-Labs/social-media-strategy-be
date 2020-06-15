const server = require('../../server');
const request = require('supertest');
const db = require('../../../data/dbConfig');
const Lists = require('../listModel');

const listModelTesting = () => {

    describe('GET /', () => { 

        it('has process.env.NODE_ENV as "testing"', () => {
            expect(process.env.NODE_ENV).toBe('testing');
        });

        it('returns 200 OK', () => {
            return request(server).get('/')
                .expect(200)
        });

    });

    describe('GET available lists', () => {

        beforeEach(async() => {
            await db('lists')
                .delete()
        });

        test('returns 0 lists', async () => {
            let listTotal;
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(0);
        })

        test('returns 1 list', async () => {
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(0);
            await Lists.add({
                okta_uid: "123AbC",
                index: 1,
                title: "Mrs. Robinson"
            });
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(1);
        })

        test('returns 1 found list', async () => {
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(0);
            await Lists.add({
                okta_uid: "123AbC",
                index: 1,
                title: "Mrs. Robinson"
            });
            await Lists.add({
                okta_uid: "abc123",
                index: 2,
                title: "Mr. Ed"
            });
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(2);
            let totalFound;            
            totalFound = await Lists.findBy({
                title: "Mrs. Robinson"
            });
            expect(totalFound).toHaveLength(1);
        })

        test('deletes title: Mrs. Robinson', async () => {
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(0);
            await Lists.add({
                id: 1,
                okta_uid: "okta_uid_1",
                index: 1,
                title: "Mrs. Robinson"
            });
            await Lists.add({
                id: 2,
                okta_uid: "okta_uid_2",
                index: 2,
                title: "Mr. Big"
            });
            await Lists.add({
                id: 3,
                okta_uid: "okta_uid_3",
                index: 3,
                title: "Mr. & Mrs. Smith"
            });
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(3); 
            await Lists.remove(1, "okta_uid_1");
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(2); 
        })

        test('updates id 1 title to "Mr. Smith Goes to Washington"', async () => {
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(0);
            await Lists.add({
                id: 1,
                okta_uid: "okta_uid_1",
                index: 1,
                title: "Mrs. Robinson"
            });
            await Lists.add({
                id: 2,
                okta_uid: "okta_uid_2",
                index: 2,
                title: "Mr. Big"
            });
            await Lists.add({
                id: 3,
                okta_uid: "okta_uid_3",
                index: 3,
                title: "Mr. & Mrs. Smith"
            });
            listTotal = await Lists.get();
            expect(listTotal).toHaveLength(3);
            await Lists.update({
                title: "Mr. Smith Goes to Washington"
            }, 1, "okta_uid_1");
            let listObject;
            listObject = await Lists.findBy({
                id: 1
            });
            expect(listObject).toHaveLength(1);
            let updateFound;
            updateFound = await Lists.findBy({
                title: "Mr. Smith Goes to Washington"
            });
            expect(updateFound).toHaveLength(1);
        })

    })

}

listModelTesting();