const WebSocket = require('ws');

const port = process.env.PORT || 8080;


let lastQuestion = "";
let lastAnswer = "";

wss.on('connection', ws => {
    ws.send(JSON.stringify({
        type: "init",
        question: lastQuestion,
        answer: lastAnswer
    }));

    ws.on('message', msg => {
        const data = JSON.parse(msg);

        if (data.type === "question") {
            lastQuestion = data.text;
        }

        if (data.type === "answer") {
            lastAnswer = data.text;
        }

        // broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});

console.log("JensonAI server running on ws://localhost:8080");
