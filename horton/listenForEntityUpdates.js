const {Observable} = require("rxjs");
const axios = require('axios');

module.exports = ({subscriptionMap, eventStream}) => {
  eventStream
    .filter(({value}) => value.type === "ENTITY_UPDATED")
    .map(message => {
      const {source} = message.value;
      const {entityKey, entityId} = source.action;
      message.value.source.action.key = `${entityKey}_${entityId}`;
      return message;
    })
    .filter(message => {
      const {source} = message.value;
      const {key} = source.action;

      if (!subscriptionMap[key]) {
        console.log(`Not sending message to BFF because there is no subscribers for entity ${key}`);
      }

      return subscriptionMap[key]
    })
    .mergeMap(sendMessageToBFF)
    .subscribe(message => {
      console.log(message)
    }, err => console.error(err), () => console.log("COMPLETE"));

  function sendMessageToBFF(message) {
    console.info("Received a message from the event stream", message);
    const {payload, source} = message.value;
    const {key} = source.action;
    const socketId = subscriptionMap[key];

    const params = {
      socketId,
      action: {
        type: "ENTITY_UPDATED",
        payload, source
      }
    };

    return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
      .map(ans => ans.data)
      .catch(error => {
        console.error("Something went wrong when trying to send an update entity to the bff", error);
        return Observable.empty()
      })
  }
};


