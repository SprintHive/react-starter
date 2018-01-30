
module.exports = ({state, eventStream, sendMessage, offset}) => {
  eventStream
    .filter(({value}) => value.type === "AVATAR_URL_CAPTURED")
    .subscribe(message => {
      console.info("write-avatar-url: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;
      const {avatarUrl} = payload;

      // ensure entity exists on the state object
      if (!state[entityKey]) state[entityKey] = {};

      let found = state[entityKey][entityId];
      if (found) {
        found.avatarUrl = avatarUrl
      } else {
        state[entityKey][entityId] = {avatarUrl}
      }

      const source = {
        service: {name: "write-avatar-url"},
        action: {entityKey, entityId, type}
      };

      message.offset > offset && sendMessage({type: "ENTITY_UPDATED", payload: {avatarUrl}, source})
    });
};