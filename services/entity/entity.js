#!/usr/bin/env node

require('dotenv').config();
const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3008;

const createStore = require('./createStore');
const readApi = require('./readApi');
const writeApi = require('./writeApi');

app.use(express.json());
app.use(cors());

const createConsumer = require('../../lib/createConsumer');
const entityTopicStream = createConsumer({
  consumerConfig: {replay: true},
  streamOptions: {
    topics: process.env.entityTopic
  }
});

const {manageOffset, readOffset} = require('../../lib/writeStateToDisk');
const offset = readOffset(__dirname);
manageOffset(entityTopicStream, __dirname);

const createProducer = require('../../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: process.env.entityTopic}});
const store = createStore({entityTopicStream, sendMessage, offset});
writeApi({app, sendMessage, store});
readApi({app, store});

const server = http.listen(port, () => {
  const port = server.address().port;
  console.log(`http server listening at http://localhost:${port}`);
});