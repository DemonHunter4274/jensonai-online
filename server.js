const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  let filePath = "./public" + req.url;
  if (req.url === "/") filePath = "./public/consumer.html";

  const ext = path.extname(filePath);
  const contentType =
    ext === ".html" ? "text/html; charset=utf-8" : "text/plain; charset=utf-8";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});
