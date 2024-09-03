const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const authenticate = require('../../src/middlewares/authMiddleware');

router.get('/', authenticate, PostController.getPosts);
router.get('/:id', authenticate, PostController.getPost);
router.post('/', authenticate, PostController.createPost);
router.put('/:id', authenticate, PostController.updatePost);
router.delete('/all', authenticate, PostController.deleteAllPosts);
router.delete('/:id', authenticate, PostController.deletePost);

module.exports = router;
