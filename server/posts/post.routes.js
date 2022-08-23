const PostController = require("./postController");
const express = require("express");

const postsRouter = express.Router();

postsRouter.get("/", PostController.readPosts);
postsRouter.get("/:id", PostController.getPostById);
postsRouter.post("/", PostController.createPost);
postsRouter.patch("/:id", PostController.updatePost);
postsRouter.delete("/:id", PostController.deletePost);

postsRouter.get("/:postID/comments", PostController.readCommentsByPost);

postsRouter.post("/utils/tags", PostController.getTagsFrequencies);
postsRouter.get(":postID/comments", PostController.readCommentsByPost);
postsRouter.get("/utils/average", PostController.getAveragePostAmount);

module.exports = postsRouter;
