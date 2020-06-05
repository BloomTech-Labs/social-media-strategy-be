describe('GET /', () => {
    it('has process.env.NODE_ENV as "testing"', () => {
        expect(process.env.NODE_ENV).toBe('testing');
    })
});