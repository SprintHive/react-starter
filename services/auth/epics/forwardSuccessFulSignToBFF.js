const axios = require("axios");
const {Observable} = require('rxjs');

const forwardSuccessFulSignToBFF = (action$, store, deps) => {
  return action$.ofType("SIGN_IN_SUCCESSFUL")
    .filter(action => {
      const offset = deps.offset || -1;
      if (!action.meta.offset > offset) {
        console.log(`Skipping due to offset ${action.meta.offset} > ${offset} ${action.type}`);
      }
      return action.meta.offset > offset
    })
    .mergeMap(action => {
      const {payload, type, source} = action;

      const params = {
        socketId: source.action.meta.socketId,
        action: {type, payload, source}
      };

      console.log("Forwarding successful sign-in to bff", params);
      return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
        .map(ans => ans.data)
        .catch(error => {
          console.error("Something went wrong when trying to send an update entity to the bff", error);
          return Observable.empty()
        })
    }).mergeMap(() => {
      return Observable.empty();
    })
};

module.exports = {forwardSuccessFulSignToBFF};