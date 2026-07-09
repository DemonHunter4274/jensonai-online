const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

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

        if (data.type === "question") lastQuestion = data.text;
        if (data.type === "answer") lastAnswer = data.text;

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});

console.log("Server running on port " + port);
