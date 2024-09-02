const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const authentiate = require('../../src/middlewares/authMiddleware');

router.get('/', authentiate, PostController.getPosts);
router.get('/:id', authentiate, PostController.getPost);
router.post('/', authentiate, PostController.createPost);
router.put('/:id', authentiate, PostController.updatePost);
router.delete('/all', authentiate, PostController.deleteAllPosts);
router.delete('/:id', authentiate, PostController.deletePost);

module.exports = router;
