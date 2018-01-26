#!/usr/bin/env node

/**
 * A in memory implementation of CQRS
 */

const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3708;

// const opts = {brokers: 'kafka://127.0.0.1:9092', groupId: "cqrs"};

// const connectEventStream = require('../lib/connectEventStream');
// const {eventStream} = connectEventStream(opts);
const writeName = require('./writeName');
const writeDob = require('./writeDateOfBirth');
const writeAvatarUrl = require('./writeAvatarUrl');
const calculateAge = require('./calculateAge');

// Add middleware here
app.use(express.json());
app.use(cors());

const state = {
  person: {
    "1": {"avatarUrl": "/avatars/DT-Avatar.png", "name": "Dale"},
    "2": {"avatarUrl": "/avatars/DLR-Avatar.png", "name": "Dirk"},
    "3": {"avatarUrl": "/avatars/GK-Avatar.png", "name": "Greg"},
    "4": {"avatarUrl": "/avatars/JLL-Avatar.png", "name": "Jon"},
    "5": {"avatarUrl": "/avatars/DB-Avatar.png", "name": "Dane"},
    "6": {"avatarUrl": "/avatars/SL-Avatar.png", "name": "Sam"},
    "7": {"avatarUrl": "/avatars/JZ-Avatar.png", "name": "JZ"},
    "8": {"avatarUrl": "/avatars/TJ-Avatar.png", "name": "Trevor"},
    "9": {"avatarUrl": "/avatars/NE-Avatar.png", "name": "Nic"},
    "10": {"avatarUrl": "/avatars/MT-Avatar.png", "name": "Marco"}
  }
};

writeName({state});
writeAvatarUrl({state});
writeDob({state});
calculateAge({state});

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
    ? res.send(Object.keys(entity).map(userId => ({...entity[userId], userId })))
    : res.status(404).send({message: "Resource not found"})
});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`Http server listening at http://localhost:${port}`);
});

// const loadInitialState = require('./loadInitialState');
// loadInitialState();