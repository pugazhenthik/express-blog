const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const auth = require('../../src/middlewares/authMiddleware');

router.get('/', auth, CategoryController.getCategories);
router.get('/:id', auth, CategoryController.getCategory);
router.post('/', auth, CategoryController.createCategory);
router.put('/:id', auth, CategoryController.updateCategory);
router.delete('/:id', auth, CategoryController.deleteCategory);

module.exports = router;
