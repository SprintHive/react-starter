const {remove} = require('../../lib/arrayUtils');

const initialState = {
  connectedSockets: [],
  socketMap: {}
};

function updateEntity(state, action) {
  const ans = {...state};
  const {entityKey, entityId, payload} = action;

  // ensure entity exists on the state object
  if (!ans[entityKey]) ans[entityKey] = {};

  let found = ans[entityKey][entityId];
  if (found) {
    ans[entityKey][entityId] = {...found, ...payload}
  } else {
    ans[entityKey][entityId] = payload;
  }
  return ans;
}

function connect(state, action) {
  const ans = {...state};
  const {socketId} = action.payload;
  ans.socketMap[socketId] = {socketId, createdAt: Date.now()};
  if (!ans.connectedSockets.includes(socketId)) ans.connectedSockets.push(socketId);
  return ans;
}

function disconnect(state, action) {
  const ans = {...state};
  const {socketId} = action.payload;
  remove(socketId, ans.connectedSockets);
  delete ans.socketMap[socketId];
  return ans;
}

function signIn(state, action) {
  const ans = {...state};
  const socketId = action.source.action.meta.socketId;
  ans.socketMap[socketId] = {...ans.socketMap[socketId], ...{user: action.payload}};
  return ans;
}

function signOut(state, action) {
  const ans = {...state};
  const {socketId} = action.payload;
  if(ans.socketMap[socketId]) ans.socketMap[socketId].user = null;
  return ans;
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case "SOCKET_CONNECTED":
      return connect(state, action);

    case "SOCKET_DISCONNECTED":
      return disconnect(state, action);

    case "SIGN_IN_SUCCESSFUL":
      return signIn(state, action);

    case "SIGN_OUT_SUCCESSFUL":
      return signOut(state, action);

    case "NAME_CAPTURED":
    case "PASSWORD_CAPTURED":
    case "AVATAR_URL_CAPTURED":
      return updateEntity(state, action);

    default:
      return state;
  }
};

module.exports = reducer;