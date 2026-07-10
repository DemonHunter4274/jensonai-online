const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 8080;

// Serve static files from /public
const server = http.createServer((req, res) => {
  let filePath = "./public" + req.url;

  // Default page
  if (req.url === "/") filePath = "./public/consumer.html";

  const ext = path.extname(filePath);
  const contentType =
    ext === ".html"
      ? "text/html; charset=utf-8"
      : "text/plain; charset=utf-8";

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

// Attach WebSocket server to the SAME HTTP server
const wss = new WebSocket.Server({ server });

let lastQuestion = "";
let lastAnswer = "";

wss.on("connection", ws => {
  ws.send(JSON.stringify({
    type: "init",
    question: lastQuestion,
    answer: lastAnswer
  }));

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    if (data.type === "question") lastQuestion = data.text;
    if (data.type === "answer") lastAnswer = data.text;

    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

server.listen(port, () => {
  console.log("Server running on port " + port);
});
