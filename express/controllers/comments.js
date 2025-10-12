// ==== GET & POST for comments
const getCommentsHandler = (req, res) => {
  res.send("Get commnets route");
};
const postCommentsHandler = (req, res) => {
  res.send("Post commnets route");
};

// ==== GET & POST for single comment
const getCommentHandler = (req, res) => {
  console.log(req.params);

  res.send(`Get single commnet route. Comment ID: ${req.params.commentId}`);
};
const deleteCommentHandler = (req, res) => {
  res.send(
    `Delete single commnet route. Deleted comment ID: ${req.params.commentId}`
  );
};

module.exports = {
  getCommentsHandler,
  postCommentsHandler,
  getCommentHandler,
  deleteCommentHandler,
};
