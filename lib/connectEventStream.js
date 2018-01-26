const {Subject} = require('rxjs');

module.exports = (opts = { brokers: 'kafka://127.0.0.1:9092'}) => {
  const eventStream = new Subject();

  const KafkaObservable = require('kafka-observable')(opts);
  const producer = KafkaObservable.toTopic('event-stream', eventStream);
  producer.subscribe(message => console.info(message));

  return {
    KafkaObservable,
    eventStream
  }
};