const express = require('express')
const path = require('path')
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express()
app.use(express.static(path.join(__dirname, '/')));

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', function (ws) {
  console.log('Client connected for audio echo.');
  ws.on('message', function message(data) {
    ws.send(data, (err) => {
      if (err) {
        console.error('Error sending audio data:', err);
        ws.send(JSON.stringify({ status: 'ok' }));
      }
    });
  });
  ws.on('error', console.error);
  ws.on('close', function () {
    console.log('stopping client interval');
  });
});

server.listen(8080,"0.0.0.0", function () {
  console.log('Listening on http://localhost:8080');
});