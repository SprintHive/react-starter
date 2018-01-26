const moment = require('moment');

function send(KafkaObservable, action) {
  const producer = KafkaObservable.toTopic('event-stream', action);
  producer.subscribe(message => console.info(message), err => console.error(err));
}

const brokers = 'kafka://127.0.0.1:9094';
module.exports = ({state, opts = {brokers, groupId: "calculate-age"}}) => {
  const KafkaObservable = require('kafka-observable')(opts);
  KafkaObservable.fromTopic('event-stream')
    .let(KafkaObservable.JSONMessage())
    .filter(message => message.type === "DATE_OF_BIRTH_CAPTURED")
    .subscribe(message => {
      console.info("calculate-age: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message;
      let found = state[entityKey][entityId];

      const {dateOfBirth} = payload;
      const mDob = moment(dateOfBirth);
      const mNow = moment();
      const age = mNow.diff(mDob, 'years');

      if (found) {
        found.age = age
      } else {
        state[entityKey][entityId].age = age;
      }

      const source = {
        service: {name: "calculate-age"},
        action: {entityKey, entityId, type}
      };

      send(KafkaObservable, {type: "ENTITY_UPDATED", payload: {age}, source});
    });
};