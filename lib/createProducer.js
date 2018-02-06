require('dotenv').config();
const Kafka = require("node-rdkafka");

const defaultConfig = {
  globalConfig: {
    'metadata.broker.list': process.env.brokers
  },
  topicConf: {},
  streamOptions: {
    topic: process.env.topic || 'test-event-stream'
  }
};

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




