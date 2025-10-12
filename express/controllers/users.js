const getUsersHandler = (req, res) => {
  res.send("Get user route");
};
const postUsersHandler = (req, res) => {
  res.send("Post user route");
};
const getUserHandler = (req, res) => {
  console.log(req.params);

  res.send(`Get user route. User ID: ${req.params.usersId}`);
};
const deleteUserHandler = (req, res) => {
  res.send(`Delete user route. User ID: ${req.params.usersId}`);
};

module.exports = {
  getUsersHandler,
  postUsersHandler,
  getUserHandler,
  deleteUserHandler,
};
