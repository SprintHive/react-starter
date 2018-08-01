const {remove} = require('../lib/arrayUtils');
const calcKey = require('../lib/calcKey');

const initialState = {
  subscriptionMap: {}
};

function subscribeToEntity(state, action) {
  const ans = {...state};
  const {payload, meta} = action;
  const {entityKey, entityId} = payload;
  const {socketId} = meta;
  const key = calcKey(entityKey, entityId);
  if (!ans.subscriptionMap[key]) ans.subscriptionMap[key] = [];
  !ans.subscriptionMap[key].includes(socketId) && ans.subscriptionMap[key].push(socketId);
  return ans;
}

function cleanUpSubscriptions(socketId, subscriptionMap) {
  Object.keys(subscriptionMap)
    .map(k => subscriptionMap[k])
    .forEach(array => remove(socketId, array));
}

function unsubscribeFromEntity(state, action) {
  const ans = {...state};
  const {payload, meta} = action;
  const {entityKey, entityId} = payload;
  const {socketId} = meta;
  const key = calcKey(entityKey, entityId);
  if (ans.subscriptionMap[key]) {
    remove(socketId, ans.subscriptionMap[key]);
    ans.subscriptionMap[key].length === 0 && delete ans.subscriptionMap[key];
  }
  return ans;
}

function disconnect(state, action) {
  const ans = {...state};
  const {meta} = action;
  const {socketId} = meta;
  cleanUpSubscriptions(socketId, state.subscriptionMap);
  return ans;
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "SUBSCRIBE_TO_ENTITY":
      return subscribeToEntity(state, action);

    case "UNSUBSCRIBE_TO_ENTITY":
      return unsubscribeFromEntity(state, action);

    case "SOCKET_DISCONNECTED":
      return disconnect(state, action);

    default:
      return state;
  }
};

module.exports = reducer;