

module.exports = ({state, eventStream, sendMessage, offset}) => {
  eventStream
    .filter(({value}) => value.type === "PASSWORD_CAPTURED")
    .subscribe(message => {
      console.info("write-password: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;
      const {passwordHashed} = payload;

      // ensure entity exists on the state object
      if (!state[entityKey]) state[entityKey] = {};

      let found = state[entityKey][entityId];
      if (found) {
        found.passwordHashed = passwordHashed
      } else {
        state[entityKey][entityId] = {name}
      }

      const source = {
        service: {name: "write-password"},
        action: {entityKey, entityId, type}
      };

      message.offset > offset && sendMessage({type: "ENTITY_UPDATED", payload: {passwordHashed}, source});
    });
};