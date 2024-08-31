const Post = require('../models/Post');

const getPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const filters = {};

        if (req.query.title) {
            filters.title = { $regex: req.query.title, $options: 'i' };
        }
        const posts = await Post.find(filters)
            .populate('author', ['first_name', 'last_name'])
            .populate('categories', ['name'])
            .populate('tags', ['name'])
            .limit(limit);
        if (!posts) {
            res.status(200).json({
                message: 'No records found',
                data: [],
            });
        } else {
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', ['first_name'])
            .populate('categories', 'name')
            .populate('tags', 'name');
        if (!post) {
            res.status(404).json({
                message: 'Post not found!',
            });
        } else {
            res.status(200).json(post);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;
        const post = await Post.create({
            title,
            content,
            author,
            tags,
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating post',
            error: error.message,
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(post);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error updating post',
            error: error.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ message: 'Post deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const deleteAllPosts = async (req, res) => {
    try {
        await Post.deleteMany({});
        res.status(200).json({ message: 'Posts are deleted successfully!' });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    deleteAllPosts,
};
