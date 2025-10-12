const express = require("express");

const router = express.Router();

const {
  getCommentsHandler,
  postCommentsHandler,
  getCommentHandler,
  deleteCommentHandler,
} = require("../controllers/comments");

router.route("/").get(getCommentsHandler).post(postCommentsHandler);

router
  .route("/:commentId")
  .get(getCommentHandler)
  .delete(deleteCommentHandler);

module.exports = router;
