

module.exports = ({state, eventStream, sendMessage}) => {

  eventStream
    .filter(({value}) => value.type === "NAME_CAPTURED")
    .subscribe(message => {
      console.info("write-name: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;
      const {name} = payload;

      // ensure entity exists on the state object
      if (!state[entityKey]) state[entityKey] = {};

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

      //todo this must not be on the event-stream but a message-steam instead.
      sendMessage({type: "ENTITY_UPDATED", payload: {name}, source});
    });
};