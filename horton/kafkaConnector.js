const {Subject} = require('rxjs');

module.exports = (opts = { brokers: 'kafka://127.0.0.1:9092'}) => {
  const eventSourceStream = new Subject();
  const KafkaObservable = require('kafka-observable')(opts);
  const producer = KafkaObservable.toTopic('event-stream', eventSourceStream);
  producer.subscribe(message => console.info(message));

  return {
    eventSourceStream
  }
};