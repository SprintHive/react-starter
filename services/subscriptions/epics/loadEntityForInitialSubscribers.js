const {Observable} = require('rxjs');
const axios = require('axios');
const {printError} = require('../../../lib/axiosUtils');
const calcKey = require('../../../lib/calcKey');



const loadEntityForInitialSubscribers = (action$, store, deps) => {

  function sendMessageToBFF(action, subscriptionMap) {
    console.info("Sending an action from the event stream to the bff", action);
    const {payload, source, type} = action;
    const {entityKey, entityId} = source.action;
    const key = calcKey(entityKey, entityId);
    const socketIds = subscriptionMap[key];
    
    const params = {
      socketIds,
      action: {type, payload, source}
    };

    return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
      .map(ans => ans.data)
      .catch(e => {
        printError({e, message: "Something went wrong when trying to send an update entity to the bff"});
        return Observable.empty()
      });
  }

  action$.filter(({type}) => type === "SUBSCRIBE_TO_ENTITY")
    .mergeMap(action => {
      const {payload, meta} = action;
      const {socketId} = meta;
      const {entityKey, entityId} = payload;
      let endpoint = `http://localhost:3008/cqrs/read/v1/fact/${entityKey}`;
      if (entityId) endpoint = `${endpoint}/${entityId}`;

      return Observable.fromPromise(axios.get(endpoint))
        .map(({data}) => ({
          type: "ENTITY_LOADED",
          meta: {socketId, fromServer: true},
          payload: data,
          source: {
            service: "Subscriptions",
            action: {entityKey, entityId}
          }
        }))
        .catch(e => {
          printError({e, message: "Something went wrong when trying to load an entity"});
          return Observable.empty()
        })
    })
    .mergeMap(entityLoadedAction => sendMessageToBFF(entityLoadedAction, store.getState().subscriptionMap))
    .subscribe(ans => {
      console.log("Successfully sent entity loaded to the bff", ans)
    }, err => console.error(err));

  return Observable.empty();
};

module.exports = {loadEntityForInitialSubscribers};