const express = require("express");

const router = express.Router();


const commentsRouter = require("./comments");
const usersRouter = require("./users");
const rootRouter = require('./root')

router.use("/comments", commentsRouter)
router.use("/users", usersRouter)
router.use("/", rootRouter)

module.exports = router