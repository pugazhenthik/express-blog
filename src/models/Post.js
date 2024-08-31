const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        categories: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Category',
            },
        ],
        tags: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tag',
            },
        ],
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
