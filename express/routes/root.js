const express = require("express");

const router = express.Router();
const { getRootHandler } = require("../controllers/root");

router.route('/').get(getRootHandler);

module.exports = router;
