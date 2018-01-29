require('dotenv').config();
const Kafka = require('node-rdkafka');
const {Observable} = require('rxjs');
const uuid = require('./uuid');

const defaultConfig = {
  consumerConfig: {
    replay: false,
    offset: null
  },
  globalConfig: {
    'metadata.broker.list': process.env.brokers,
    'socket.keepalive.enable': true,
    'enable.auto.commit': false,
    'group.id': 'default-group-id'
  },
  topicConfig: {
    'auto.offset.reset': 'earliest'
  },
  streamOptions: {
    topics: process.env.topic || 'test-event-stream'
  }
};

const mergeConfig = (config, defaultConfig) => {
  return config ? {...defaultConfig, ...config} : defaultConfig;
};


module.exports = ({globalConfig, topicConfig, streamOptions, consumerConfig} = defaultConfig) => {
  return Observable.create(function (observer) {
    globalConfig = mergeConfig(globalConfig, defaultConfig.globalConfig);
    consumerConfig = mergeConfig(consumerConfig, defaultConfig.consumerConfig);
    topicConfig = mergeConfig(topicConfig, defaultConfig.topicConfig);
    streamOptions = mergeConfig(streamOptions, defaultConfig.streamOptions);

    const {replay, offset} = consumerConfig;
    if (replay) globalConfig['group.id'] = uuid();

    console.log("Creating a consumer", {globalConfig, topicConfig, streamOptions, consumerConfig});
    const stream = Kafka.KafkaConsumer.createReadStream(globalConfig, topicConfig, streamOptions);

    const messageReceived = (message) => {
      observer.next({
        value: JSON.parse(message.value.toString()),
        offset: message.offset,
        timestamp: message.timestamp,
        topic: message.topic,
        partition: message.partition
      });
    };

    stream.on('data', function (message) {
      if (replay && offset) {
        message.offset <= offset && messageReceived(message);
      } else {
        messageReceived(message);
      }
    });

    stream.on('error', function (error) {
      console.error(error);
    });
  });
};


