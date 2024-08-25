const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res
                .status(200)
                .json({ message: 'No records found', data: [] });
        }
        return res.status(200).json({ data: users });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while fetching users',
            error: error.message,
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User not found', data: [] });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while fetching a user',
            error: error.message,
        });
    }
};

const createUser = async (req, res) => {
    try {
        if (!req.body.first_name) {
            throw new Error('User first name is required');
        }

        if (!req.body.last_name) {
            throw new Error('User last name is required');
        }

        if (!req.body.email) {
            throw new Error('User email is required');
        }

        if (!req.body.password) {
            throw new Error('User password is required');
        }

        const user = await User.create(req.body);
        res.status(201).json({
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while creating a user',
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res
            .status(200)
            .json({ message: 'User updated successfully', data: user });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while updating a user',
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while deleting a user',
            error: error.message,
        });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
