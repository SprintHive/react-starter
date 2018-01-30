module.exports = ({state, eventStream, sendMessage, offset}) => {
  eventStream
    .filter(({value}) => value.type === "DATE_OF_BIRTH_CAPTURED")
    .subscribe(message => {
      console.info("write-dob: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;
      const {dateOfBirth} = payload;
      let found = state[entityKey][entityId];
      if (found) {
        found.dateOfBirth = dateOfBirth
      } else {
        state[entityKey][entityId] = {dateOfBirth}
      }

      const source = {
        service: {name: "write-dob"},
        action: {entityKey, entityId, type}
      };

      message.offset > offset && sendMessage({type: "ENTITY_UPDATED", payload: {dateOfBirth}, source})
    });
};