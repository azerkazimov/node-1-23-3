import http from "http";
import fs from "fs";

const PORT = 4004;

const server = http.createServer((req, res) => {
const filePath = "./files/index.html"

  if (req.method === `GET` && req.url === "/") {
    const readStream = fs.createReadStream(filePath);
    res.statusCode = 200;
    res.setHeader("COntent-Type", "text/html");
    readStream.pipe(res);
  }
  if (req.method === `GET` && req.url === "/no-stream") {
    fs.readFile(filePath,(err, data)=>{
        if(err) {
            res.statusCode = 500
            res.end('Error reading file on server')
        } else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(data)
        }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
