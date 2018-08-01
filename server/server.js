#!/usr/bin/env node

const express = require("express");
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const port = process.env.PORT || 3701;

// Add middleware here
app.use(express.json());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../client/build');
  console.log(`Serving up static content form ${clientPath}`);
  app.use(express.static(clientPath));
}

app.get('/sockets', function (req, res) {
  io.of('/').clients((err, clients) => {
    res.json(clients)
  })
});

app.get('/rooms', function (req, res) {
  res.json(io.sockets.adapter.rooms)
});

require('./ConfigureStore')({io});
app.get('/ping', require("./HealthCheck"));
app.post('/api/dispatch', require('./HttpActionConnector')({io}));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`Http server listening at http://localhost:${port}`);
});
