const {Subject} = require('rxjs');

module.exports = (opts = {brokers: 'kafka://127.0.0.1:9092', groupId: "horton"}) => {

  const eventStream = new Subject();

  const KafkaObservable = require('kafka-observable')(opts);
  const producer = KafkaObservable.toTopic('event-stream', eventStream);
  producer.subscribe(message => console.info(message));

  // return a function which can send actions to the event stream
  return {
    dispatch: function (action) {
      eventStream.next(action)
    }
  }
};