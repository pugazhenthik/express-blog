const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
    },
    content: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
