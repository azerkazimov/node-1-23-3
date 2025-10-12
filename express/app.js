const express = require("express");
const router = require("./routes")
const app = express();

const PORT = "3003";


// const commentsRouter = require("./routes/comments");
// const usersRouter = require("./routes/users");
// const rootRouter = require('./routes/root')

// const getRootHandler = (req, res) => {
//   res.send("Get root route");
// };

// // ==== GET & POST for comments
// const getCommentsHandler = (req, res)=>{
//     res.send('Get commnets route')
// }
// const postCommentsHandler = (req, res)=>{
//     res.send('Post commnets route')
// }

// // ==== GET & POST for single comment
// const getCommentHandler = (req, res)=>{
//     console.log(req.params);

//     res.send(`Get single commnet route. Comment ID: ${req.params.commentId}`)
// }
// const deleteCommentHandler = (req, res)=>{
//     res.send(`Delete single commnet route. Deleted comment ID: ${req.params.commentId}`)
// }

// app.use(rootRouter);

// app.get("/comments", getCommentsHandler)
// app.post("/comments", postCommentsHandler)

// app.get("/comments/:commentId", getCommentHandler)
// app.delete("/comments/:commentId", deleteCommentHandler)

// app.use(commentsRouter);
// app.use("/users", usersRouter);

// users

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
