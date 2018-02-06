#!/usr/bin/env node

require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3009;

const readApi = require('./readApi');
const writeApi = require('./writeApi');

app.use(express.json());
app.use(cors());

const createProducer = require('../../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: process.env.authTopic}});

const createConsumer = require('../../lib/createConsumer');
const authTopicStream = createConsumer({
  consumerConfig: {replay: true},
  streamOptions: {
    topics: process.env.authTopic
  }
});

const entityTopicStream = createConsumer({
  consumerConfig: {replay: true},
  streamOptions: {
    topics: process.env.entityTopic
  }
});

const {manageOffset, readOffset} = require('../../lib/writeStateToDisk');
const offset = readOffset(__dirname);
console.log('offset:', offset);
manageOffset(authTopicStream, __dirname);

const createStore = require('./createStore');
const store = createStore({authTopicStream, entityTopicStream, sendMessage, offset});

readApi({app, store});
writeApi({app, sendMessage, store});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`Auth http server listening at http://localhost:${port}`);
});