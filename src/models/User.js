const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Author', 'User'],
        default: 'User',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
