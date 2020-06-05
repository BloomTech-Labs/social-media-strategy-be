const server = require('../../server');
const request = require('supertest');
const db = require("../../../data/dbConfig");
const Lists = require('../listModel');

const listModelTesting = endpoint => {

    describe('Testing router', () => {
       
       test('should run tests', () => {
           expect(true).toBe(true);
       });

       test('should make sure root is working properly', () => {
           return request(server).get('/')
              .expect(200)
              .expect('Content-Type', /json/)
              .then(res => {
                  expect(res.body.message).toBe("IT'S WORKING!!!")
              })
       });

    });

    describe('Get function', () => {

        test('should return a list from db', async () => {
            const listsNumber = await Lists.get();
            expect(listsNumber).toHaveLength(0);                        
        });

    });

};

listModelTesting();