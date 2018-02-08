const {Observable} = require('rxjs');
const axios = require('axios');
const {printError} = require('../../../lib/axiosUtils');

function sendMessageToBFF(action) {
  console.info("Sending an action from the event stream to the bff");
  const socketId = action.meta.socketId;

  const params = {socketId, action};

  return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
    .map(ans => ans.data)
    .catch(e => {
      printError({e, message: "Something went wrong when trying to send an update entity to the bff"});
      return Observable.empty()
    });
}

const forwardEntityCreatedToSubscriber = (action$, store, deps) => {
  const withListOfActionsToFilter = ["ENTITY_CREATED"];
  action$
    .do(action => console.log("*********", JSON.stringify(action,null,2)))
    .filter(({type}) => withListOfActionsToFilter.includes(type))
    .filter(action => {
      // ensure that there is a socket
      // todo check if we still have a list of the connected sockets so that we can filter out sockets that are no longer connected
      return action.meta.socketId !== null && action.meta.socketId !== undefined
    })
    .mergeMap(sendMessageToBFF)
    .subscribe(ans => {
      console.log("Successfully sent an entity created action to the bff", ans)
    }, err => console.error(err));

  return Observable.empty();
};

module.exports = {forwardEntityCreatedToSubscriber};