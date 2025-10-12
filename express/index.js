const http = require("http");
const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.send("<h1>Here is HTTP request from express</h1>");
})

// const server = http.createServer((req, res) => {
//   if (req.method=== "GET" || req.url === "/") {
//     res.end("Here is HTTP request");
//   }
// });

// const server = http.createServer(app);

// server.listen(3007, () => {
//   console.log("Server is running on port: 3007");
// });

app.listen(3007, ()=>{
  console.log("Server is running from express on port: 3007");
})
