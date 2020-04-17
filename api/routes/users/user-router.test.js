const request = require('supertest');
require('dotenv').config();
const server = require('../../server');
// const db = require("../../../data/db.config");
// const Users = require('./users-model');

let token;

describe('testing user router', () => {
  test('should run tests', () => {
    expect(true).toBe(true);
  });

  describe('Test Auth /GET /api/users', () => {
    it('should run 401', async () => {
      const res = await request(server).get('/api/users');

      expect(res.status).toBe(401);
    });
  });

  describe('Test Auth + header /GET /api/users', () => {
    beforeAll(done => {
      request(server)
        .post('/api/auth/login')
        .send({
          email: process.env.EMAIL_TEST,
          password: process.env.PASSWORD_TEST
        })
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should run 200', () => {
      return request(server)
        .get('/api/users')
        .set('authorization', ` ${token}`)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
    it('should be json', () => {
      return request(server)
        .get('/api/users')
        .set('authorization', ` ${token}`)
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.type).toMatch(/json/);
        });
    });
    it('should be Array/users', done => {
      request(server)
        .get('/api/users')
        .set('authorization', ` ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body)).toBe(true);
          console.log(res.body);
          done();
        });
    });
  });


      //Users model testing for add() 
    //   describe('insert users model function', () => {
    //     it('inserts a new user into the db', async () => {
    //         await db('users').truncate();
    //         let usersLength;
    //         usersLength = await db('users');
    //         expect(usersLength).toHaveLength(0);

    //         await Users.add({
    //             id: 3,
    //             email: "new@newnew.com",
    //             password: "password"
    //         })

    //         usersLength = await db('users');
           
    //         expect(usersLength).toHaveLength(1);


    //         await Users.add({
    //           id: 4,
    //           email: "newnew@newnew.com",
    //           password: "password"
    //         })

    //         usersLength = await db('users');
    //         expect(usersLength).toHaveLength(2);

    //     });
    // });
});
