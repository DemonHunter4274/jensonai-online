const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 8080;

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("JensonAI Online Mode is running ✅");
});

// Attach WebSocket to the same server
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

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

server.listen(port, () => console.log("Server running on port " + port));

