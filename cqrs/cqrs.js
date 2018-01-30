#!/usr/bin/env node

require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3708;

const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: process.env.messageTopic}});

const {manageOffset, getOffset} = require('./manageOffset');

const state = {};

getOffset.subscribe((offset) => {
  const createConsumer = require('../lib/createConsumer');
  const eventStream = createConsumer({consumerConfig: {replay: true}});
  manageOffset(eventStream);
  const signIn = require('./signIn');
  const writeName = require('./writeName');
  const writePassword = require('./writePassword');
  const writeAvatarUrl = require('./writeAvatarUrl');
  const writeDob = require('./writeDateOfBirth');
  const calculateAge = require('./calculateAge');

  const reducerConfig = {state, eventStream, sendMessage, offset};

  signIn(reducerConfig);
  writeName(reducerConfig);
  writePassword(reducerConfig);
  writeAvatarUrl(reducerConfig);
  writeDob(reducerConfig);
  calculateAge(reducerConfig);
});

// Add middleware here
app.use(express.json());
app.use(cors());


app.get('/ping', function (req, res) {
  res.send("hello")
});

app.get('/state', function (req, res) {
  res.send(state)
});

app.get('/cqrs/read/v1/fact/:entityKey/:entityId', function (req, res) {
  const {entityKey, entityId} = req.params;

  const entity = state[entityKey][entityId];
  entity
    ? res.send(entity)
    : res.status(404).send({message: "Resource not found"})
});

app.get('/cqrs/read/v1/fact/:entityKey', function (req, res) {
  const {entityKey} = req.params;

  const entity = state[entityKey];
  entity
    ? res.send(entity)
    : res.status(404).send({message: "Resource not found"})
});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`Http server listening at http://localhost:${port}`);
});