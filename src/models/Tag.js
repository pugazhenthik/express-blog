const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        min: 3,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
