process.env.SECRET_KEY = 'scretkey';
const request = require('supertest');
const User = require('../../src/models/User');
const app = require('../../app');
const nodemailer = require('nodemailer');

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

    it('should handle user not found error in forgot password', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            null;
        });

        const user = await request(app).post('/auth/forgot-password');

        expect(user.status).toBe(404);
        expect(user.body.message).toBe('User not found');
    });

    it('should handle server error in forgot password', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            return {
                _id: 1,
                save: jest.fn().mockImplementation(() => {
                    throw new Error('Server error');
                }),
            };
        });

        const res = await request(app).post('/auth/forgot-password');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Something went wrong email not sent');
    });

    it('should handle error in sending forgot password email', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            return {
                _id: 1,
                save: jest.fn(),
            };
        });
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => {
            return {
                sendMail: jest
                    .fn()
                    .mockImplementationOnce((mailOptions, callback) => {
                        callback(new Error('Failed to send email'), null);
                    }),
            };
        });

        const user = await request(app).post('/auth/forgot-password');

        expect(user.status).toBe(200);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Error:Error: Failed to send email',
        );
        expect(user.body.message).toBe(
            'Password reset email sent to your inbox',
        );
    });

    it('should an email successfully', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            return {
                _id: 1,
                save: jest.fn(),
            };
        });
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        jest.spyOn(nodemailer, 'createTransport').mockImplementationOnce(() => {
            return {
                sendMail: jest
                    .fn()
                    .mockImplementationOnce((mailOptions, callback) => {
                        callback(null, { response: 'ok' });
                    }),
            };
        });

        const user = await request(app).post('/auth/forgot-password');
        expect(user.status).toBe(200);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Error:Error: Failed to send email',
        );
        expect(user.body.message).toBe(
            'Password reset email sent to your inbox',
        );
    });

    it('should send a reset password link successfully', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            return {
                _id: 1,
                save: jest.fn(),
            };
        });

        const user = await request(app).post('/auth/forgot-password');

        expect(user.status).toBe(200);
        expect(user.body.message).toBe(
            'Password reset email sent to your inbox',
        );
    });

    afterAll(() => {
        delete process.env.SECRET_KEY;
    });

    it('should handle token invalid error in reset password', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => null);

        const res = await request(app).get('/auth/reset-password/token');
        console.log(res.body);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            'Password reset token is invalid or has expired',
        );
    });

    it('should handle error in reset password', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            throw new Error('Server error');
        });

        const res = await request(app).get('/auth/reset-password/token');
        console.log(res.body);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Error resetting password');
    });

    it('should reset password successfully', async () => {
        jest.spyOn(User, 'findOne').mockImplementation(() => {
            return {
                _id: 1,
                save: jest.fn(),
            };
        });

        const res = await request(app).get('/auth/reset-password/token');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Password has been reset successfully');
    });
});
