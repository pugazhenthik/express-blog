process.env.SECRET_KEY = 'scretkey';
const request = require('supertest');
const User = require('../../src/models/User');
const app = require('../../app');

describe('AuthController', () => {
    it('should handle error in login', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            throw new Error('Database error');
        });

        const user = await request(app).post('/auth/login');
        console.log(user.body);
        expect(user.status).toBe(500);
        expect(user.body.message).toBe('Error logged in');
    });

    it('should handle invalid email or password error', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => null);

        const user = await request(app).post('/auth/login');
        console.log(user.body);
        expect(user.status).toBe(401);
        expect(user.body.message).toBe('Invalid email or password');
    });

    it('should handle invalid password error', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            return {
                email: 'test@gmail.com',
                password: 'password',
                comparePassword: jest.fn(),
            };
        });

        const user = await request(app).post('/auth/login');
        expect(user.status).toBe(401);
        expect(user.body.message).toBe('Incorrect password');
    });

    it('should login successfully', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            return {
                email: 'test@gmail.com',
                password: 'password',
                comparePassword: jest.fn().mockReturnValue(true),
            };
        });
        const user = await request(app).post('/auth/login');
        expect(user.status).toBe(200);
        expect(user.body.message).toBe('User login successfull');
    });

    afterAll(() => {
        delete process.env.SECRET_KEY;
    });
});
