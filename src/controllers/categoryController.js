const Category = require('../models/Category');

const getCategories = async (req, res) => {};
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json(category);
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        req.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
};
