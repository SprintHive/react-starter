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

const userMap = {};
const socketMap = {};

app.get('/sockets', function (req, res) {
  io.of('/').adapter.clients((err, clients) => {
    res.json(clients)
  })
});

// require('./Sockets')({io, socketMap, userMap});
// require('./Reducer')({io, socketMap, userMap});
require('./ConfigureStore')({io});
app.get('/ping', require("./HealthCheck"));
app.get('/async-example', require('./AsyncExample'));
app.post('/api/dispatch', require('./HttpActionConnector')({io, socketMap, userMap}));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`Http server listening at http://localhost:${port}`);
});
