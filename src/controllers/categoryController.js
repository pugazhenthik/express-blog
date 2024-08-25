const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while fetching categories.',
            error: error.message,
        });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found!' });
        } else {
            res.status(200).json(category);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while fetching a category.',
            error: error.message,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            message: 'Category created successfully!',
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while creating a category',
            error: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            },
        );

        if (!category) {
            res.status(404).json({
                message: 'Category not found!',
            });
        } else {
            res.status(200).json({
                message: 'Category updated successfully!',
                data: category,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while updating a category.',
            error: error.message,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (category) {
            res.status(200).json({ message: 'Category deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Category not found!' });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong while deleting a category.',
            error: error.message,
        });
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};
