const CommentController = require("./commentController");
const express = require("express");

const commentsRouter = express.Router();

commentsRouter.get("/post/:postId", CommentController.readComments);
commentsRouter.get("/:id", CommentController.getCommentById);
commentsRouter.post("/", CommentController.createComment);
commentsRouter.delete("/:id", CommentController.deleteComment);

module.exports = commentsRouter;
