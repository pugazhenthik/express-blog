const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.post('/', CategoryController.createCategory);

module.exports = router;
