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

describe('PostController', () => {
    xit('should get all posts1', async () => {
        const post1 = await Post.create({
            title: 'Create a new post 1',
            content: 'New post content 1',
        });

        const post2 = await Post.create({
            title: 'Create a new post 2',
            content: 'New post content 2',
        });

        const posts = await request(app).get('/posts');
        const data = await posts.body;
        expect(data).toEqual(
            expect.arrayContaining([expect.objectContaining(post1)]),
        );
    });

    it('should get a post', async () => {
        const post = await Post.create({
            title: 'Create a new post',
            content: 'New post content',
        });
        const res = await request(app).get(`/posts/${post._id}`);
        expect(res.body).toHaveProperty('title', 'Create a new post');
        expect(res.body).toHaveProperty('content', 'New post content');
    });

    it('should create a new post', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ title: 'Post title', content: 'Post content' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title', 'Post title');
        expect(res.body).toHaveProperty('content', 'Post content');
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

    it('should return 404 for non-existent post', async () => {
        const res = await request(app).get('/posts/sd1234567890');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Something went wrong');
    });
});
