#!/usr/bin/env node

/**
 * This is a mocked out back end to manage auth and socket management.
*/

const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3702;

const {lookupUser} = require('./userDB');

// Add middleware here
app.use(express.json());
app.use(cors());

const userMap = {};
const socketMap = {};

app.get('/ping', function (req, res) {
  res.send("hello")
});

app.get('/sockets', function (req, res) {
  res.send(socketMap)
});

app.get('/users', function (req, res) {
  res.send(userMap)
});

app.post('/login', (req, res) => {
  console.log('login', req.body);
  const {username, password, socketId} = req.body;
  const found = lookupUser(username);

  socketMap[socketId] = found;
  userMap[found.userId] = socketId;

  res.send(found);
});

app.post('/logout', (req, res) => {
  console.log('logout', req.body);
  const {username, socketId} = req.body;
  const found = socketMap[socketId];

  found && delete userMap[found.userId];
  delete socketMap[socketId];

  res.send({message: `${username} has been logged out`});
});


const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`🐘  Http server listening at http://localhost:${port}`);
});
