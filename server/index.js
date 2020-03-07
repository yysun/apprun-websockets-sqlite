'use strict';

const apprun = require('apprun').app;
require('./db');

const express = require('express');
const path = require('path');
const { createServer } = require('http');
const webSocket = require('ws');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const server = createServer(app);
const wss = new webSocket.Server({ server });

wss.on('connection', function(ws) {
  ws.on('message', function (data) {
    try {
      const json = JSON.parse(data);
      console.log('==>', json);
      apprun.run(json.event, json, ws);
    } catch (e) {
      ws.send(e.toString());
      console.error(e);
    }
  });

  ws.on('close', function() {
    console.log('closing ws connection');
  });

  console.log('started ws connection');
});

server.listen(8080, function() {
  console.log('Listening on http://localhost:8080');
});