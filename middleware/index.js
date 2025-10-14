const express = require("express");
const qs = require("qs");

const app = express();

const port = 8080;

const morgan = require("morgan");

app.use(morgan("tiny"));

// const logger = (req, res, next)=>{
//     console.log(req.method, req.url);
//     next()
// }

// app.use(logger)

// Парсинг JSON если content type application json
// app.use((req, res, next) => {
//   let data = "";

//   req.on("data", (chunk) => (data += chunk.toString()));
//   req.on("end", () => {
//     const getData = data;
//     req.body = JSON.parse(getData);
//     next();
//   });
// });

// Короткая версия предыдущего кода
app.use(express.json());

// Короткая версия для type application urlencoded

app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
//     let data = "";

//     req.on("data", (chunk) => (data += chunk.toString()));
//     req.on("end", () => {
//       const getData = data;
//       req.body = qs.parse(getData);
//       next();
//     });
//   } else {
//     next()
//   }
// });

app.use((req, res) => {
  console.log(req.body);

  return res.send("This is express server");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
