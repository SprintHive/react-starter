module.exports = (config = {
                    messageHandler: () => console.log("I think you have forgotten something..."),
                    actionType: "ENTITY_UPDATED"
                  },
                  opts = {brokers: 'kafka://127.0.0.1:9092', groupId: "horton"}) => {

  const {messageHandler, actionType} = config;

  const KafkaObservable = require('kafka-observable')(opts);
  KafkaObservable.fromTopic('event-stream')
    .let(KafkaObservable.JSONMessage())
    .filter(message => message.type === actionType)
    .subscribe(message => {
      console.info("Received a message from the event stream", message);
      messageHandler(message);
    });
};