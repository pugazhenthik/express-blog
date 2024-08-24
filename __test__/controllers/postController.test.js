const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const Post = require('../../src/models/Post');
const { connect, disconnect } = require('../__helper__/mongodb.test.helper');

beforeAll(async () => {
    await connect();
});

afterAll(async () => {
    await disconnect();
});

beforeEach(() => {
    jest.restoreAllMocks();
});

describe('PostController', () => {
    it('should get all posts', async () => {
        await Post.create({
            title: 'Create a new post 1',
            content: 'New post content 1',
        });

        const posts = await request(app).get('/posts?title=post');
        const data = await posts.body;
        expect(data).toEqual(expect.any(Array));
    });

    it('should return 200 if get posts is empty', async () => {
        jest.spyOn(Post, 'find').mockImplementation(() => ({
            limit: jest.fn().mockResolvedValue(null),
            select: jest.fn().mockReturnThis(),
        }));
        const response = await request(app).get('/posts?limit=10&title=title');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('No records found');
        expect(response.body.data).toEqual([]);
    });

    it('should return 500 if get posts fails', async () => {
        Post.find = jest.fn().mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/posts?limit=10');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error');
    });

    it('should get a post', async () => {
        const post = await Post.create({
            title: 'Create a new post',
            content: 'New post content',
        });
        const res = await request(app).get(`/posts/${post._id}`);
        expect(200);
        expect(res.body).toHaveProperty('title', 'Create a new post');
        expect(res.body).toHaveProperty('content', 'New post content');
    });

    it('should handle errors in getting a post by id', async () => {
        const invalidPostId = new mongoose.Types.ObjectId();

        jest.spyOn(Post, 'findById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await request(app).get(`/posts/${invalidPostId}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
            message: 'Something went wrong',
            error: 'Database error',
        });

        Post.findById.mockRestore();
    });

    it('should create a new post', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ title: 'Post title', content: 'Post content' });
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
            .send({ title: 'content' });
        expect(500);
        expect(res.body).toEqual({
            error: 'Not able to create a post.',
            message: 'Error creating post',
        });
    });

    it('should update a post', async () => {
        const post = await Post.create({
            title: 'New Post',
            content: 'New Content',
        });

        const res = await request(app)
            .put(`/posts/${post._id}`)
            .send({ title: ' Post title', content: 'Post content' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'Post title');
        expect(res.body).toHaveProperty('content', 'Post content');
    });

    it('should handle error in updating post', async () => {
        jest.spyOn(Post, 'findByIdAndUpdate').mockResolvedValue(null);

        const res = await request(app).put('/posts/sdfsffsf').send({});
        expect(404);
        expect(res.body).toEqual({ message: 'Post not found' });
    });

    it('should handle error in updating post', async () => {
        jest.spyOn(Post, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await request(app).put('/posts/sdfsffsf').send({});
        expect(500);
        expect(res.body).toHaveProperty('error', 'Database error');
        expect(res.body).toHaveProperty('message', 'Error updating post');
    });

    it('should return 404 for non-existent post', async () => {
        jest.spyOn(Post, 'findById').mockImplementationOnce(() => null);
        const res = await request(app).get('/posts/66c37f742db9c1684bbcb20a');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Post not found!');
    });

    it('should delete a post ', async () => {
        const post = await Post.create({
            title: 'Delete post',
            content: 'Delete content',
        });

        const res = await request(app).delete(`/posts/${post._id}`);
        expect(200);
        expect(res.body).toHaveProperty(
            'message',
            'Post deleted successfully!',
        );
    });

    it('should handle post not found error in delete post', async () => {
        jest.spyOn(Post, 'findByIdAndDelete').mockResolvedValue(null);
        const res = await request(app).delete(`/posts/23fsfsdfsdfsdf`);
        expect(404);
        expect(res.body).toHaveProperty('message', 'Post not found');
    });

    it('should handle 500 error in delete post', async () => {
        jest.spyOn(Post, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Something went wrong');
        });
        const res = await request(app).delete(`/posts/23fsfsdfsdfsdf`);
        expect(500);
        expect(res.body).toHaveProperty('message', 'Something went wrong');
    });

    it('should delete all posts', async () => {
        await Post.create({ title: 'Title', content: 'Content' });
        const res = await request(app).delete('/posts/all');
        expect(200);
        expect(res.body).toHaveProperty(
            'message',
            'Posts are deleted successfully!',
        );
    });

    it('should handle error in delete all posts', async () => {
        jest.spyOn(Post, 'deleteMany').mockImplementationOnce(() => {
            throw new Error('Post not deleted');
        });
        const res = await request(app).delete('/posts/all');
        expect(500);
        expect(res.body).toHaveProperty('message', 'Something went wrong');
    });
});
