const express = require("express");
const qs = require("qs");
const morgan = require("morgan");
const cors = require('cors')

const app = express();

const port = 8080;


app.use(morgan("tiny"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.use((req, res) => {
  const parsedData = {
    name: "Felix",
    training: "Node.js",
    module: "express",
    dev: true,
    hobbies: ['scratch', 'eat', 'scream', 'sweet']
  }

  return res.json(parsedData);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
