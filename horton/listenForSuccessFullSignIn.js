const {Observable} = require("rxjs");
const axios = require('axios');

module.exports = ({eventStream}) => {
  eventStream
    .do((message) => console.log("Received a SIGN_IN_SUCCESSFUL message", JSON.stringify(message, null, 2)))
    .filter(({value}) => value.type === "SIGN_IN_SUCCESSFUL")
    // todo add a filter here to see if there is a socket connected with for this socket id
    .mergeMap(sendMessageToBFF)
    .subscribe(message => {
      console.log(message)
    }, err => console.error(err), () => console.log("COMPLETE"));

  function sendMessageToBFF(message) {
    console.info("Received a message from the event stream", message);
    const {payload, source, type} = message.value;
    const {entityId} = source.action;

    const params = {
      socketId: entityId,
      action: {type, payload, source}
    };

    return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
      .map(ans => ans.data)
      .catch(error => {
        console.error("Something went wrong when trying to send an update entity to the bff", error);
        return Observable.empty()
      })
  }
};


