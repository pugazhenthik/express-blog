const Tag = require('../models/Tag');

const getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        if (!tags) {
            return res
                .status(200)
                .json({ message: 'No records found', data: [] });
        }
        return res.status(200).json({ data: tags });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while fetching tags.',
            error: error.message,
        });
    }
};

const getTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res
                .status(404)
                .json({ message: 'Tag not found.', data: [] });
        }
        res.status(200).json({ data: tag });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while fetching a tag.',
            error: error.message,
        });
    }
};

const createTag = async (req, res) => {
    try {
        if (!req.body.name) {
            throw new Error('Tag name is required.');
        }

        const tag = await Tag.create(req.body);
        res.status(201).json({
            message: 'Tag created successfully.',
            data: tag,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while creating a tag.',
            error: error.message,
        });
    }
};

const updateTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        return res
            .status(200)
            .json({ message: 'Tag updated successfully.', data: tag });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while updating a tag.',
            error: error.message,
        });
    }
};

const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        return res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while deleting a tag.',
            error: error.message,
        });
    }
};

module.exports = {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
};
