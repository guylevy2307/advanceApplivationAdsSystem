const express = require("express");
const router = express.Router();

const {
    getAllUser,
    postCreateUser,
    putUpdateUser,
    deleteUser,
    serchByMail,
} = require("../controllers/user");

/**
 * @route GET api/user
 * @description get all user
 * @access public
 */
router.get("/", getAllUser);

/**
 * @route POST api/user
 * @description add a new user
 * @access public
 */
router.post("/", postCreateUser);

/**
 * @route PUT api/user/:id
 * @description update user
 * @access public
 */
router.put("/:id", putUpdateUser);

/**
 * @route DELETE api/user/:id
 * @description delete user
 * @access public
 */
router.delete("/:id", deleteUser);

/**
 * @route GET api/user
 * @description get all user
 * @access public
 */
router.get("/:mail", serchByMail);

module.exports = router;
