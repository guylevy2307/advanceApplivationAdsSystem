const CommentController = require('../Controllers/commentController')
const express = require('express');

const commentsRouter = express.Router();

commentsRouter.get('/post/:postId',CommentController.readComments);
commentsRouter.get('/:id',CommentController.getCommentById);
commentsRouter.post('/',CommentController.createComment);
// commentsRouter.patch('/:id',CommentController.updateComment);
commentsRouter.delete('/:id',CommentController.deleteComment);

module.exports = commentsRouter;