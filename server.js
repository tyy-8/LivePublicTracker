const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let playerData = [];

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/players', (req, res) => {
  const data = req.body;
  if (data && data.players && Array.isArray(data.players)) {
    playerData.push(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
    res.status(200).send('OK');
  } else {
    res.status(400).send('Bad Request');
  }
});

wss.on('connection', ws => {
  playerData.forEach(entry => {
    ws.send(JSON.stringify(entry));
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});