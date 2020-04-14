const request = require('supertest');
require('dotenv').config();
const server = require('../../server');


let token;

describe('testing posts router', () => {
    test('should run tests', () => {
        expect(true).toBe(true);
    });

    describe('Test No Auth /GET /api/posts', () => {
        it('should run 401', async () => {
            const res = await request(server).get('/api/posts');
            expect(res.status).toBe(401);
        });
    });

    describe('Test Auth header /GET /api/posts', () => {
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

        it('should return 200 OK', () => {
            return request(server)
                .get('/api/posts')
                .set('authorization', `${token}`)
                .then(res => {
                    expect(res.status).toBe(200);
                });
        });

        it('should be json', () => {
            return request(server)
                .get('/api/posts')
                .set('authorization', ` ${token}`)
                .then(res => {
                    expect(res.status).toBe(200);
                    expect(res.type).toMatch(/json/);
                })
        });

        it('GET /api/topics res.body.topics should be an array of topics', done => {
            request(server)
                .get('/api/posts')
                .set('authorization', ` ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(Array.isArray(res.body.Posts)).toBe(true);
                    done();
                });
        });

    });

   
});
