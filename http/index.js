const http = require("http");
const {
    getHome,
  getComments,
  getText,
  getHTML,
  notFound,
  postComments,
} = require("./handlers");

const PORT = 3003;

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    return getHome(req, res);
  } else if (req.method === "GET" && req.url === "/html") {
    return getHTML(req, res);
  } else if (req.method === "GET" && req.url === "/text") {
    return getText(req, res);
  } else if (req.method === "GET" && req.url === "/comments") {
    return getComments(req, res);
  } else if (req.method === "POST" && req.url === "/comments") {
    postComments(req, res);
  } else {
    notFound(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
