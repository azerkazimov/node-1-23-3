const express = require("express");

const app = express();

const firstHandler = (req, res, next) => {
  res.send("response from express");
  next()
};

const secondHandler = (req, res, next) => {
  console.log("second handler");
  next();
};

app.get("/", firstHandler, secondHandler);

app.listen(3007, () => {
  console.log("Server is running from express on port: 3007");
});
