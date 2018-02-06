const {Observable} = require('rxjs');
const axios = require('axios');
const {printError} = require('../../../lib/axiosUtils');
const calcKey = require('../../../lib/calcKey');

function sendMessageToBFF(fState) {
  console.info("Sending an action from the event stream to the bff");
  const {key, subscriptionMap, action} = fState;
  const socketIds = subscriptionMap[key];

  const params = {socketIds, action: {type: "ENTITY_UPDATED", payload: action.payload, source: {action}}};

  return Observable.fromPromise(axios.post(`http://localhost:3006/api/dispatch`, params))
    .map(ans => ans.data)
    .catch(e => {
      printError({e, message: "Something went wrong when trying to send an update entity to the bff"});
      return Observable.empty()
    });
}

const forwardEntityUpdatesToSubscribers = (action$, store, deps) => {
  const withListOfActionsToFilter = ["DATE_OF_BIRTH_CAPTURED", "AGE_CALCULATED"];
  action$.filter(({type}) => withListOfActionsToFilter.includes(type))
    .map(action => {
      const ans = {action};

      let entityKey, entityId;
      if (action.entityKey) {
        entityKey = action.entityKey;
        entityId = action.entityId;
      } else if (action.source && action.source.action) {
        entityKey = action.source.action.entityKey;
        entityId = action.source.action.entityId;
      }

      ans.key = calcKey(entityKey, entityId);
      const {subscriptionMap} = store.getState();
      ans.subscriptionMap = subscriptionMap;
      return ans;
    })
    .filter(fState => {
      const {key, subscriptionMap} = fState;

      if (!subscriptionMap[key]) {
        console.log(`Not sending message to BFF because there is no subscribers for entity ${key}`);
      }

      return subscriptionMap[key];
    })
    .mergeMap(sendMessageToBFF)
    .subscribe(ans => {
      console.log("Successfully sent an updated to the bff", ans)
    }, err => console.error(err));

  return Observable.empty();
};

module.exports = {forwardEntityUpdatesToSubscribers};