const PostController = require('../Controllers/postController')
const express = require('express');
const {getAveragePostAmount} = require("../Utils/avg-posts-map-reduce");

const postsRouter = express.Router();

postsRouter.get('/:postID/comments', PostController.readCommentsByPost);
postsRouter.get('/',PostController.readPosts);
postsRouter.get('/:id',PostController.getPostById);
postsRouter.post('/',PostController.createPost);
postsRouter.post('/utils/tags', PostController.getTagsFrequencies);
postsRouter.patch('/:id',PostController.updatePost);
postsRouter.delete('/:id',PostController.deletePost);
postsRouter.get(':postID/comments', PostController.readCommentsByPost);
postsRouter.get('/utils/average', getAveragePostAmount);

module.exports = postsRouter;