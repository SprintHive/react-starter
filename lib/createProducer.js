require('dotenv').config();
const Kafka = require("node-rdkafka");
const {Subject} = require('rxjs');

const uuid = require('../lib/uuid');
const calcKey = require('./calcKey');

const defaultConfig = {
  globalConfig: {
    'client.id': 'toothpick',
    'metadata.broker.list': process.env.brokers,
    'dr_cb': true
  },
  topicConf: {},
  streamOptions: {
    topic: process.env.topic || 'test-event-stream'
  }
};

/*
module.exports = function createProducer({globalConfig, topicConf, streamOptions} = defaultConfig) {

  if (!globalConfig) globalConfig = defaultConfig.globalConfig;
  if (!topicConf) topicConf = defaultConfig.topicConf;
  if (!streamOptions) streamOptions = defaultConfig.streamOptions;

  console.log("Initialising a producer", {globalConfig, topicConf, streamOptions});

  const stream = Kafka.Producer.createWriteStream(globalConfig, topicConf, streamOptions);
  const sendMessage = (m) => {
    console.log(`message producer: sending message ${m.type} to topic ${streamOptions.topic}`)
    return stream.write(new Buffer(JSON.stringify(m)))
      ? 'We queued our message!'
      : 'Too many messages in our queue already'
  };
  return {sendMessage};
};
*/

function generateMessageKey(message) {
  let entityKey, entityId;
  if (message.entityKey !== null && message.entityKey !== undefined) {
    entityKey = message.entityKey;
  } else if (message.payload && message.payload.entityKey !== null && message.payload.entityKey !== undefined) {
    entityKey = message.payload.entityKey;
  } else {
    entityKey = uuid();
  }

  if (message.entityId !== null && message.entityId !== undefined) {
    entityId = message.entityId;
  } else if (message.payload && message.payload.entityId !== null && message.payload !== undefined) {
    entityId = message.payload.entityId;
  }
  return calcKey(entityKey, entityId);
}

module.exports = function createProducer({globalConfig, topicConf, streamOptions} = defaultConfig) {

  if (!globalConfig) globalConfig = defaultConfig.globalConfig;
  if (!topicConf) topicConf = defaultConfig.topicConf;
  if (!streamOptions) streamOptions = defaultConfig.streamOptions;

  console.log("Initialising a producer", {globalConfig, topicConf, streamOptions});

  const subject = new Subject();

  const producer = new Kafka.Producer({
    'client.id': 'toothpick',
    'metadata.broker.list': 'localhost:9092',
    'dr_cb': true
  });

  // Connect to the broker manually
  producer.connect();

  // Wait for the ready event before proceeding
  producer.on('ready', function () {
    console.log("ready");
    // when someone sends a message send it to the kafka topic
    subject
      .filter(message => message)
      .do((message) => {
        try {
          const messageKey = generateMessageKey(message);
          producer.produce(
            streamOptions.topic,
            // optionally we can manually specify a partition for the message
            // this defaults to -1 - which will use librdkafka's default partitioner
            // (consistent random for keyed messages, random for unkeyed messages)
            null,
            new Buffer(JSON.stringify(message)),
            messageKey,
            Date.now(),
            'some-trace-id-here'
          );
        } catch (err) {
          console.error('A problem occurred when sending our message');
          console.error(err);
        }
      })
      .subscribe((message) => console.log('next'));
  });

  const sendMessage = (m) => {
    subject.next(m);
    return 'We queued our message!'
  };
  return {sendMessage};
};
