const express = require('express');
const router = express.Router();
const TagController = require('../controllers/tagController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, TagController.getTags);
router.get('/:id', auth, TagController.getTag);
router.post('/', auth, TagController.createTag);
router.put('/:id', auth, TagController.updateTag);
router.delete('/:id', auth, TagController.deleteTag);

module.exports = router;
