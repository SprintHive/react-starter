#!/usr/bin/env node

/**
 * This is a mocked out api gateway to manage auth and socket management.
*/

const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3702;
const axios = require('axios');

const {lookupUser, listUsers} = require('./userDB');

const createConsumer = require('../lib/createConsumer');
const eventStream = createConsumer({globalConfig: {'group.id': 'horton'}});

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

app.get('/team', function (req, res) {
  res.send(listUsers())
});

const startListeningForEntityUpdates = require('./listenForEntityUpdates');
startListeningForEntityUpdates({subscriptionMap, eventStream});

app.post('/cqrs/subscribe/v1/entity/:entityKey/:entityId', (req, res) => {
  console.log("Received a entityKey and entityId to subscribe to", req.params);
  const {entityKey, entityId} = req.params;
  const {socketId} = req.body;
  let key = `${entityKey}_${entityId}`;

  subscriptionMap[key]
    ? !subscriptionMap[key].includes(socketId) && subscriptionMap[key].push(socketId)
    : subscriptionMap[key] = [socketId];

  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}/${entityId}`)
    .then((ans) =>  res.send(ans.data))
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
});

app.post('/cqrs/subscribe/v1/entity/:entityKey/', (req, res) => {
  console.log("Received a entity to subscribe to", req.params);
  const {entityKey} = req.params;
  const {socketId} = req.body;
  let key = entityKey;

  subscriptionMap[key]
    ? !subscriptionMap[key].includes(socketId) && subscriptionMap[key].push(socketId)
    : subscriptionMap[key] = [socketId];

  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}/`)
    .then((ans) =>  res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}));

  console.log(`Socket ${socketId} has been subscribed to entity ${key}`);
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
    .then((ans) =>  res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}))
});

app.get('/cqrs/read/v1/fact/:entityKey', function (req, res) {
  const {entityKey} = req.params;
  axios.get(`http://localhost:3008/cqrs/read/v1/fact/${entityKey}`)
    .then((ans) =>  res.send(ans.data))
    .catch(err => res.status(err.status).send({message: err.message}))
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
