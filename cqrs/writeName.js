/**
 * Listen to a kafka topic and write data to state
 */
function send(KafkaObservable, action) {
  const producer = KafkaObservable.toTopic('event-stream', action);
  producer.subscribe(message => console.info(message), err => console.error(err));
}

const brokers = 'kafka://127.0.0.1:9093';
module.exports = ({state, opts = {brokers, groupId: "write-name"}}) => {
  const KafkaObservable = require('kafka-observable')(opts);

  KafkaObservable.fromTopic('event-stream')
    .let(KafkaObservable.JSONMessage())
    .filter(message => message.type === "NAME_CAPTURED")
    .subscribe(message => {
      console.info("write-name: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message;
      const {name} = payload;
      let found = state[entityKey][entityId];
      if (found) {
        found.name = name
      } else {
        state[entityKey][entityId] = {name}
      }

      const source = {
        service: {name: "write-name"},
        action: {entityKey, entityId, type}
      };

      send(KafkaObservable, {type: "ENTITY_UPDATED", payload: {name}, source})
    });
};