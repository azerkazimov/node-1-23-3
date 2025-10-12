const express = require("express");

const router = express.Router();
const {
  getUsersHandler,
  postUsersHandler,
  getUserHandler,
  deleteUserHandler,
} = require("../controllers/users");

// for common users:
router.route("/").get(getUsersHandler).post(postUsersHandler);

// for single user by user id:
router
  .route("/:usersId")
  .get(getUserHandler)
  .delete(deleteUserHandler);

module.exports = router;
