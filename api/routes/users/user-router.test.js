const request = require('supertest');

const server = require('../../server');

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
          email: 'hello@hello.com',
          password: 'hello'
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
});
