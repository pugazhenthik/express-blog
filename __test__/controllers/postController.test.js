process.env.SECRET_KEY = 'mysecretkey';
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

describe('PostController', () => {
    beforeEach(() => {
        jwt.verify.mockReturnValue(true);
        jest.spyOn(User, 'findById').mockImplementationOnce(() => {
            return {
                _id: '66d3f90bdcb98e05334b541d',
            };
        });
    });

    it('should get all posts successfully', async () => {
        const post = [
            {
                title: 'Create a new post 1',
                content: 'New post content 1',
                author: {
                    id: 1,
                    first_name: 'Pugazh',
                    last_name: 'K',
                },
            },
        ];

        jest.spyOn(Post, 'find').mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(post),
        });

        const res = await request(app)
            .get('/posts?title=post')
            .set('Authorization', 'Bearer valid-token');

        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].author.first_name).toBe('Pugazh');
        expect(res.body.data).toEqual(expect.any(Array));
    });

    it('should handle no records found response', async () => {
        jest.spyOn(Post, 'find').mockImplementation(() => ({
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(null),
        }));
        const response = await request(app)
            .get('/posts?limit=10&title=title')
            .set('Authorization', 'Bearer valid-token');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('No records found');
        expect(response.body.data).toEqual([]);
    });

    it('should handle error in get posts', async () => {
        Post.find = jest.fn().mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/posts?limit=10')
            .set('Authorization', 'Bearer valid-token');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error');
    });

    it('should handle post 404 not found error', async () => {
        jest.spyOn(Post, 'findById').mockReturnValue({
            populate: jest
                .fn()
                .mockReturnThis()
                .mockReturnValue({
                    populate: jest
                        .fn()
                        .mockReturnThis()
                        .mockReturnValue({
                            populate: jest.fn().mockResolvedValue(null),
                        }),
                }),
        });
        const res = await request(app)
            .get('/posts/66c37f742db9c1684bbcb20a')
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Post not found!');
    });

    it('should get a post', async () => {
        const data = {
            title: 'Create a new post',
            content: 'New post content',
            author: {
                _id: '66d28f539973448fc915f3a8',
                first_name: 'Pugazh',
                last_name: 'K',
            },
        };
        jest.spyOn(Post, 'findById').mockReturnValue({
            populate: jest
                .fn()
                .mockReturnThis()
                .mockReturnValue({
                    populate: jest
                        .fn()
                        .mockReturnThis()
                        .mockReturnValue({
                            populate: jest.fn().mockResolvedValue(data),
                        }),
                }),
        });

        const res = await request(app)
            .get(`/posts/66d28f539973448fc915f3a8`)
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'Create a new post');
        expect(res.body).toHaveProperty('content', 'New post content');
        expect(res.body).toHaveProperty('author.first_name', 'Pugazh');
        expect(res.body).toHaveProperty('author.last_name', 'K');
    });

    it('should handle errors in getting a post by id', async () => {
        const invalidPostId = new mongoose.Types.ObjectId();

        jest.spyOn(Post, 'findById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app)
            .get(`/posts/${invalidPostId}`)
            .set('Authorization', 'Bearer valid-token');

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
            message: 'Something went wrong',
            error: 'Database error',
        });

        Post.findById.mockRestore();
    });

    it('should create a new post', async () => {
        const data = {
            title: 'Post title',
            content: 'Post content',
            author: {
                _id: '66d28f539973448fc915f3a8',
                first_name: 'Pugazh',
                last_name: 'K',
            },
        };

        jest.spyOn(Post, 'create').mockImplementation(() => data);
        const res = await request(app)
            .post('/posts')
            .send({ title: 'Post title', content: 'Post content' })
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title', 'Post title');
        expect(res.body).toHaveProperty('content', 'Post content');
    });

    it('should handle errors in creating post', async () => {
        jest.spyOn(Post, 'create').mockImplementation(() => {
            throw new Error('Not able to create a post.');
        });
        const res = await request(app)
            .post('/posts')
            .send({ title: 'content' })
            .set('Authorization', 'Bearer valid-token');

        expect(500);
        expect(res.body).toEqual({
            error: 'Not able to create a post.',
            message: 'Error creating post',
        });
    });

    it('should update a post', async () => {
        const data = {
            _id: '66d28f539973448fc915f3a2',
            title: 'Post title',
            content: 'Post content',
            author: {
                _id: '66d28f539973448fc915f3a8',
                first_name: 'Pugazh',
                last_name: 'K',
            },
        };

        jest.spyOn(Post, 'findByIdAndUpdate').mockImplementation(() => data);

        const res = await request(app)
            .put(`/posts/${data._id}`)
            .send({ title: ' Post title', content: 'Post content' })
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'Post title');
        expect(res.body).toHaveProperty('content', 'Post content');
    });

    it('should handle error in updating post', async () => {
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValue(null);

        const res = await request(app)
            .put('/posts/sdfsffsf')
            .send({})
            .set('Authorization', 'Bearer valid-token');

        expect(404);
        expect(res.body).toEqual({ message: 'Post not found' });
    });

    it('should handle error in updating post', async () => {
        jest.spyOn(Post, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await request(app)
            .put('/posts/sdfsffsf')
            .send({})
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Database error');
        expect(res.body).toHaveProperty('message', 'Error updating post');
    });

    it('should delete a post ', async () => {
        jest.spyOn(Post, 'findByIdAndDelete').mockReturnValue({
            message: 'Post deleted successfully!',
        });
        const res = await request(app)
            .delete(`/posts/66d28f539973448fc915f3a8`)
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
            'message',
            'Post deleted successfully!',
        );
    });

    it('should handle post not found error in delete post', async () => {
        jest.spyOn(Post, 'findByIdAndDelete').mockResolvedValue(null);
        const res = await request(app)
            .delete(`/posts/66d28f539973448fc915f3a8`)
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Post not found');
    });

    it('should handle 500 error in delete post', async () => {
        jest.spyOn(Post, 'findByIdAndDelete').mockRejectedValue({
            message: 'Something went wrong',
        });
        const res = await request(app)
            .delete(`/posts/23fsfsdfsdfsdf`)
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Something went wrong');
    });

    it('should delete all posts', async () => {
        jest.spyOn(Post, 'deleteMany').mockResolvedValue({
            message: 'Posts are deleted successfully!',
        });

        const res = await request(app)
            .delete('/posts/all')
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
            'message',
            'Posts are deleted successfully!',
        );
    });

    it('should handle error in delete all posts', async () => {
        jest.spyOn(Post, 'deleteMany').mockImplementationOnce(() => {
            throw new Error('Posts are not deleted');
        });
        const res = await request(app)
            .delete('/posts/all')
            .set('Authorization', 'Bearer valid-token');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Something went wrong');
    });
});
