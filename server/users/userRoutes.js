const userController = require("./userController");
const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/", userController.readUsers);
usersRouter.get("/:email", userController.getUserByEmail);
usersRouter.post("/", userController.createUser);
usersRouter.patch("/:email", userController.updateUser);
usersRouter.delete("/:email", userController.deleteUser);

usersRouter.post("/login", userController.logIn);

usersRouter.get("/:userEmail/posts", userController.readPostsByUser);

usersRouter.get("/search", userController.searchUsers);

usersRouter.post("/:email/addFriend", userController.addUserFriend);
usersRouter.get("/:email/friends", userController.getFriendsByUser);

usersRouter.get("/popular/firstNames", userController.getPopularFirstNames);
usersRouter.get("/popular/lastNames", userController.getPopularLastNames);

usersRouter.get("/analytics/mostactive", userController.getMostActiveUsers);
usersRouter.get("/analytics/addresses", userController.getAllUserAddresses);

module.exports = usersRouter;
