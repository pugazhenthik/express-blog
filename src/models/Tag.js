const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
