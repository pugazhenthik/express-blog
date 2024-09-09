const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const auth = require('../../src/middlewares/authMiddleware');

router.get('/', auth, PostController.getPosts);
router.get('/:id', auth, PostController.getPost);
router.post('/', auth, PostController.createPost);
router.put('/:id', auth, PostController.updatePost);
router.delete('/all', auth, PostController.deleteAllPosts);
router.delete('/:id', auth, PostController.deletePost);

module.exports = router;
