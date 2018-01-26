const {Observable} = require("rxjs");
const axios = require('axios');
const brokers = 'kafka://127.0.0.1:9092';

module.exports = ({subscriptionMap}) => {
  const opts = {brokers: brokers, groupId: "horton"};
  const KafkaObservable = require('kafka-observable')(opts);
  const entityUpdatedStream = KafkaObservable.fromTopic('event-stream')
    .let(KafkaObservable.JSONMessage())
    .filter(message => message.type === "ENTITY_UPDATED");

  entityUpdatedStream
    .mergeMap(sendMessageToBFF)
    .subscribe(message => {
      console.log(message)
    }, err => console.error(err), () => console.log("COMPLETE"));

  function sendMessageToBFF(message) {
    console.info("Received a message from the event stream", message);
    const {payload, source} = message;
    const {entityKey, entityId} = source.action;
    const key = `${entityKey}_${entityId}`;
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


