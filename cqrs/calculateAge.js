const moment = require('moment');

module.exports = ({state, eventStream, sendMessage}) => {
  eventStream
    .filter(({value}) => value.type === "DATE_OF_BIRTH_CAPTURED")
    .subscribe(message => {
      console.info("calculate-age: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;
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

      sendMessage({type: "ENTITY_UPDATED", payload: {age}, source});
    });
};