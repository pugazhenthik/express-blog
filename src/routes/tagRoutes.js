const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');

router.get('/', TagController.getTags);
router.get('/:id', TagController.getTag);
router.post('/', TagController.createTag);
router.put('/:id', TagController.updateTag);
router.delete('/:id', TagController.deleteTag);

module.exports = router;
