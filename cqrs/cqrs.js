#!/usr/bin/env node

/**
 * A in memory implementation of CQRS
 */

const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3708;

const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer();

const createConsumer = require('../lib/createConsumer');
const eventStream = createConsumer({consumerConfig: {replay: true}});

const writeName = require('./writeName');
const writeAvatarUrl = require('./writeAvatarUrl');
const writeDob = require('./writeDateOfBirth');
const calculateAge = require('./calculateAge');

// Add middleware here
app.use(express.json());
app.use(cors());

const state = {};

const reducerConfig = {state, eventStream, sendMessage};

writeName(reducerConfig);
writeAvatarUrl(reducerConfig);
writeDob(reducerConfig);
calculateAge(reducerConfig);

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