const request = require('supertest');
require('dotenv').config();
const server = require('../../server');

const endpointAuthTesting = (endpoint) => {
    let token;

    describe('Testing router', () => {
        test('should run tests', () => {
            expect(true).toBe(true);
        });
    
        describe(`Test no auth GET`, () => {
            it('should run 401', async () => {
                const res = await request(server).get(`/api/${endpoint}`);
    
                expect(res.status).toBe(401);
            });
        });
    
        describe('Test auth login and endpoint' , () => {
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
                    .get(`/api/${endpoint}`)
                    .set('authorization', `${token}`)
                    .then(res => {
                        expect(res.status).toBe(200);
                    });
            });
    
            it('should be json', () => {
                return request(server)
                    .get(`/api/${endpoint}`)
                    .set('authorization', ` ${token}`)
                    .then(res => {
                        expect(res.status).toBe(200);
                        expect(res.type).toMatch(/json/);
                    });
            });
    
            // it('GET endpoint res.body should be an array of results', done => {
            //     request(server)
            //         .get(`/api/${endpoint}`)
            //         .set('authorization', ` ${token}`)
            //         .expect('Content-Type', /json/)
            //         .expect(200)
            //         .then(res => {
            //             expect(Array.isArray(res.body.endpoint)).toBe(true);
            //             done();
            //         });
            // });
    
        });
    });

};


endpointAuthTesting('lists');
endpointAuthTesting('posts');
endpointAuthTesting('users');