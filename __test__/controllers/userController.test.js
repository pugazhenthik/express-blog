const request = require('supertest');
const User = require('../../src/models/User');
const app = require('../../app');

describe('UserController', () => {
    it('should get all users', async () => {
        const data = [
            {
                first_name: 'Pugazh',
                last_name: 'K',
                email: 'user@user.com',
                password: 'password',
                role: 'User',
                isActive: true,
            },
            {
                first_name: 'Yugan',
                last_name: 'P',
                email: 'user@user.com',
                password: 'password',
                role: 'User',
                isActive: true,
            },
        ];
        jest.spyOn(User, 'find').mockImplementation(() => data);

        const users = await request(app).get('/users');

        expect(users.status).toBe(200);
        expect(users.body.data.length).toBe(2);
    });

    it('should handle error in get all users', async () => {
        jest.spyOn(User, 'find').mockImplementation(() => null);

        const users = await request(app).get('/users');

        expect(users.status).toBe(200);
        expect(users.body.message).toBe('No records found');
        expect(users.body.data).toEqual([]);
    });

    it('should handle error in get all users', async () => {
        jest.spyOn(User, 'find').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const users = await request(app).get('/users');

        expect(users.status).toBe(500);
        expect(users.body.message).toBe(
            'Something went wrong while fetching users',
        );
        expect(users.body.error).toBe('Database error!');
    });

    it('should get a user', async () => {
        const data = { id: 1, isActive: false, name: 'User 1' };
        jest.spyOn(User, 'findById').mockImplementation(() => data);

        const user = await request(app).get('/users/1');

        expect(user.status).toBe(200);
        expect(user.body.data).toHaveProperty('name', 'User 1');
    });

    it('should handle user not found 404 error', async () => {
        jest.spyOn(User, 'findById').mockResolvedValue(null);

        const user = await request(app).get('/users/1');

        expect(user.status).toBe(404);
        expect(user.body.message).toBe('User not found');
    });

    it('should handle error in fetching user', async () => {
        jest.spyOn(User, 'findById').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const user = await request(app).get('/users/1');

        expect(user.status).toBe(500);
        expect(user.body.message).toBe(
            'Something went wrong while fetching a user',
        );
        expect(user.body.error).toBe('Database error!');
    });

    it('should handle error in create user', async () => {
        jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const response = await request(app)
            .post('/users')
            .send({ name: 'Node js' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe(
            'Something went wrong while creating a user',
        );
    });

    it('should handle first name validtion error in create a user', async () => {
        jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error('Validation error');
        });

        const response = await request(app).post('/users').send({});

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('User first name is required');
        expect(response.body.message).toBe(
            'Something went wrong while creating a user',
        );
    });

    it('should handle last name validtion error in create a user', async () => {
        jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error('Validation error');
        });

        const response = await request(app)
            .post('/users')
            .send({ first_name: 'Pugazh' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('User last name is required');
        expect(response.body.message).toBe(
            'Something went wrong while creating a user',
        );
    });

    it('should handle last name validtion error in create a user', async () => {
        jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error('Validation error');
        });

        const response = await request(app)
            .post('/users')
            .send({ first_name: 'Pugazh', last_name: 'K' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('User email is required');
        expect(response.body.message).toBe(
            'Something went wrong while creating a user',
        );
    });

    it('should handle last name validtion error in create a user', async () => {
        jest.spyOn(User, 'create').mockImplementation(() => {
            throw new Error('Validation error');
        });

        const response = await request(app).post('/users').send({
            first_name: 'Pugazh',
            last_name: 'K',
            email: 'user@user.com',
        });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('User password is required');
        expect(response.body.message).toBe(
            'Something went wrong while creating a user',
        );
    });

    it('should handle validtion error in create a user', async () => {
        const data = {
            first_name: 'Pugazh',
            last_name: 'K',
            email: 'user@user.com',
            password: 'password',
            role: 'User',
            isActive: true,
        };
        jest.spyOn(User, 'create').mockImplementation(() => data);

        const response = await request(app).post('/users').send(data);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
    });

    it('should handle error in update a user', async () => {
        jest.spyOn(User, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const user = await request(app).put('/users/1').send({});

        expect(user.status).toBe(500);
        expect(user.body.message).toBe(
            'Something went wrong while updating a user',
        );
        expect(user.body.error).toBe('Database error!');
    });

    it('should handle error 404 not found user in update user', async () => {
        jest.spyOn(User, 'findByIdAndUpdate').mockReturnValue(null);

        const user = await request(app).put('/users/1').send({});

        expect(user.status).toBe(404);
        expect(user.body.message).toBe('User not found');
    });

    it('shold update a user given input', async () => {
        const data = { id: 1, name: 'Updated user', isAction: true };
        jest.spyOn(User, 'findByIdAndUpdate').mockImplementation(() => data);

        const user = await request(app).put('/users/1').send(data);

        expect(user.status).toBe(200);
        expect(user.body.message).toBe('User updated successfully');
    });

    it('should handle user not found error in delete user', async () => {
        jest.spyOn(User, 'findByIdAndDelete').mockImplementation(() => null);

        const user = await request(app).delete('/users/1');

        expect(user.status).toBe(404);
        expect(user.body.message).toBe('User not found');
    });

    it('should handle error in delete user', async () => {
        jest.spyOn(User, 'findByIdAndDelete').mockImplementation(() => {
            throw new Error('Database error!');
        });

        const user = await request(app).delete('/users/1');

        expect(user.status).toBe(500);
        expect(user.body.message).toBe(
            'Something went wrong while deleting a user',
        );
        expect(user.body.error).toBe('Database error!');
    });

    it('should delete a user', async () => {
        jest.spyOn(User, 'findByIdAndDelete').mockImplementation(() => true);

        const user = await request(app).delete('/users/1');

        expect(user.status).toBe(200);
        expect(user.body.message).toBe('User deleted successfully');
    });
});
