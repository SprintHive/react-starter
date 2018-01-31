#!/usr/bin/env node

/**
 * This is a mocked out api gateway to manage auth and socket management.
 */
require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3702;
const axios = require('axios');

const createConsumer = require('../lib/createConsumer');
const eventStream = createConsumer({
  globalConfig: {'group.id': 'horton'},
  streamOptions: {topics: process.env.messageTopic}
});

const createProducer = require('../lib/createProducer');
const {sendMessage} = createProducer();

// Add middleware here
app.use(express.json());
app.use(cors());

const userMap = {};
const socketMap = {};
const subscriptionMap = {};

app.get('/ping', function (req, res) {
  res.send("hello")
});

app.get('/sockets', function (req, res) {
  res.send(socketMap)
});

app.get('/users', function (req, res) {
  res.send(userMap)
});

app.get('/subscriptions', function (req, res) {
  res.send(subscriptionMap)
});

const startListeningForEntityUpdates = require('./listenForEntityUpdates');
startListeningForEntityUpdates({subscriptionMap, eventStream});

const startListenForSuccessFullSignIns = require('./listenForSuccessFullSignIn');
startListenForSuccessFullSignIns({eventStream});

app.post('/cqrs/subscribe/v1/entity/:entityKey/:entityId', (req, res) => {
  console.log("Received a entityKey and entityId to subscribe to", req.params);
  const {entityKey, entityId} = req.params;
  const {socketId} = req.body;
  let key = `${entityKey}_${entityId}`;

  subscriptionMap[key]
    ? !subscriptionMap[key].includes(socketId) && subscriptionMap[key].push(socketId)
    : subscriptionMap[key] = [socketId];

  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}/${entityId}`)
    .then((ans) => res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}));

  console.log(`Socket ${socketId} has been subscribed to entity ${key}`);
});

app.post('/cqrs/unsubscribe/v1/entity/:entityKey/:entityId', (req, res) => {
  console.log("Received a entityKey and entityId to unsubscribe from ", req.params);
  const {entityKey, entityId} = req.params;
  const {socketId} = req.body;
  let key = `${entityKey}_${entityId}`;

  if (subscriptionMap[key]) {
    const index = subscriptionMap[key].indexOf(socketId);
    console.log(index, subscriptionMap[key]);
    if (index > -1) subscriptionMap[key].splice(index, 1);
  }

  console.log(subscriptionMap[key]);
  console.log(`Socket ${socketId} has un-subscribed from entity ${key}`);
  res.send({message: `Socket ${socketId} has un-subscribed from entity ${key}`})
});

app.post('/cqrs/subscribe/v1/entity/:entityKey/', (req, res) => {
  console.log("Received a entityKey to subscribe to", req.params);
  const {entityKey} = req.params;
  const {socketId} = req.body;
  let key = entityKey;

  subscriptionMap[key]
    ? !subscriptionMap[key].includes(socketId) && subscriptionMap[key].push(socketId)
    : subscriptionMap[key] = [socketId];

  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}/`)
    .then((ans) => res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}));

  console.log(`Socket ${socketId} has been subscribed to entity ${key}`);
});

app.post('/cqrs/unsubscribe/v1/entity/:entityKey/', (req, res) => {
  console.log("Received a entityKey to unsubscribe from ", req.params);
  const {entityKey} = req.params;
  const {socketId} = req.body;
  let key = entityKey;

  if (subscriptionMap[key]) {
    remove(socketId, subscriptionMap[key]);
  }

  console.log(subscriptionMap[key]);
  console.log(`Socket ${socketId} has un-subscribed from entity ${key}`);
  res.send(`Socket ${socketId} has un-subscribed from entity ${key}`);
});

app.post('/cqrs/write/v1/fact/:entityKey/:entityId/:action', (req, res) => {
  console.log("Received a fact to write", req.params);
  const {entityKey, entityId, action} = req.params;
  const {payload} = req.body;
  sendMessage({entityKey, entityId, type: action, payload});
  res.send({message: "Fact has been recorded"})
});

app.get('/cqrs/read/v1/fact/:entityKey/:entityId', function (req, res) {
  const {entityKey, entityId} = req.params;
  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}/${entityId}`)
    .then((ans) => res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}))
});

app.get('/cqrs/read/v1/fact/:entityKey', function (req, res) {
  const {entityKey} = req.params;
  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}`)
    .then((ans) => res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}))
});

app.post('/logout', (req, res) => {
  console.log('logout', req.body);
  const {username, socketId} = req.body;
  const found = socketMap[socketId];

  found && delete userMap[found.userId];
  delete socketMap[socketId];

  res.send({message: `${username} has been logged out`});
});


// remove a value from an array
function remove(value, array) {
  const i = array.indexOf(value);
  i > -1 && array.splice(i, 1);
}

function cleanUpSubscriptions(socketId, subscriptionMap) {
  Object.keys(subscriptionMap)
    .map(k => subscriptionMap[k])
    .forEach(array => remove(socketId, array));
}

app.post('/socket/disconnect', (req, res) => {
  console.log('socket disconnect ', req.body);
  const {socketId} = req.body;
  const found = socketMap[socketId];

  found && delete userMap[found.userId];
  delete socketMap[socketId];
  cleanUpSubscriptions(socketId, subscriptionMap);
  res.send({message: `Socket ${socketId} has been disconnected`});
});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`🐘  Http server listening at http://localhost:${port}`);
});
