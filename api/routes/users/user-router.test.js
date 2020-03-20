const request = require('supertest')

const server = require('../../server')

let token;

describe('test user router', () => {
    test('should run tests ', () => {
        expect(true).toBe(true);
    });
    
describe('Test Auth /get /api/users', () => {
it('should run 401', async () => {
    const res = await request(server).get('/api/users');

    expect(res.status).toBe(401)
});

});

describe('Test Auth + header /GET /api /users', () => {
    beforeAll(done => {

        request(server)
        .post('')
    })
})


})
