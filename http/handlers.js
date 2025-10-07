const comments = require("./data");
const fs = require("fs");
const qs = require("querystring");

function getHome(req, res) {
  fs.readFile("./files/comment-form.html", (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Server error while adding HTML file");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    }
  });
}

function getHTML(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Server is run</h1>");
}

function getText(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Server is run");
}

// get comments
function getComments(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(comments));
}

// post comments
function postComments(req, res) {
  res.setHeader("Content-Type", "text/plain");

  if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
    let body = "";

    req.on("data", (chuck) => (body += chuck));

    req.on("end", () => {
      try {
        const comment = qs.parse(body);
        comments.push(comment);
        console.log(comment);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html')
        res.write('<h1>Comment form was recived</h1>')
        res.write('<a href="/">add one more comment</a>')
        res.end();
      } catch (error) {
        res.statusCode = 400;
        res.end("Invalid form data");
      }
    });
  } else if (req.headers["content-type"] === "application/json") {
    let comment = "";

    req.on("data", (chuck) => (comment += chuck));

    req.on("end", () => {
      try {
        comments.push(JSON.parse(comment));
        res.statusCode = 200;
        res.end("Comment was recived");
      } catch (error) {
        res.statusCode = 400;
        res.end("Invalid JSON");
      }
    });
  } else {
    req.statusCode = 400;
    res.end("data must be in JSON format or in form data");
  }
}

function notFound(req, res) {
  res.statusCode === 404;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Page not found</h1>");
}

module.exports = {
  getHome,
  getHTML,
  getComments,
  postComments,
  getText,
  notFound,
};
