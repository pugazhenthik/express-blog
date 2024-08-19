const Post = require('../models/Post');

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        if (!posts)
            res.status(200).json({
                message: 'No records found',
                data: [],
            });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)
            res.status(200).json({
                message: 'Post not found!',
            });
        res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const createPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
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
        }
        res.json(post);
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
            res.status(500).json({ message: 'Post not deleted' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
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
};
