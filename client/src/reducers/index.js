import ls from 'local-storage';

const initialState = {
  connection: {status: "connecting", timeConnected: undefined},
  auth: {user: null},
  loading: {},
  entities: {},
  captureLead: {
    // lead: {
    //   leadId: '1cd9b5d7-9339-49d4-8a8e-5fa6e0fbf86e',
    //   creationDate: '2018-02-14T05:37:00.444Z',
    //   version: 0
    // }
  }
};

export function calcKey(entityKey, entityId) {
  let key = entityKey;
  if (entityId) key = `${entityKey}_${entityId}`;
  return key;
}

function handleSubscribeToEntity(state, action) {
  const ans = {...state};
  const loading = {...state.loading};
  const {entityKey, entityId} = action.payload;
  const key = calcKey(entityKey, entityId);
  loading[key] = true;
  ans.loading = loading;
  return ans;
}

function entityCreated(state, action) {
  const ans = {...state};
  const {entityKey, entityId, payload} = action;

  // ensure that the entityKey is in the entities object
  if (!ans.entities[entityKey]) ans.entities[entityKey] = {};

  let found = ans.entities[entityKey][entityId];
  if (!found) ans.entities[entityKey][entityId] = payload;
  return ans;
}

function entityUpdated(state, action) {
  const ans = {...state};
  const loading = {...state.loading};
  const entities = {...state.entities};
  const {entityKey, entityId} = action.source.action;
  const delta = action.payload;

  if (entityId) {
    let found = entities[entityKey] && entities[entityKey][entityId];
    if (found) {
      entities[entityKey][entityId] = {...found, ...delta}
    } else {
      entities[entityKey] = {};
      entities[entityKey][entityId] = {...delta}
    }
  } else {
    let found = entities[entityKey];
    if (found) {
      entities[entityKey] = {...found, ...delta}
    } else {
      entities[entityKey] = {...delta}
    }
  }
  ans.entities = entities;

  const key = calcKey(entityKey, entityId);
  loading[key] = false;
  ans.loading = loading;

  return ans;
}

function leadCreated(state, action) {
  const ans = {...state};
  const {leadId, creationDate, version} = action.payload;
  ans.captureLead.lead = {leadId, creationDate, version};
  return ans;
}

function leadUpdated(state, action) {
  const ans = {...state};
  const delta = action.payload;
  let found = ans.captureLead.lead;
  if (found) {
    ans.captureLead.lead = {...found, ...delta};
  } else {
    ans.captureLead.lead = {...delta};
  }
  return ans;
}

export default (state = initialState, action) => {
  switch (action.type) {

    case "SOCKET_CONNECTION_STATUS_CHANGED_ACTION":
      const {status, socketId} = action.payload;
      const connection = {status, socketId};
      if (status === 'Connected') connection.timeConnected = Date.now();
      return {...state, connection};

    case "SIGN_IN_SUCCESSFUL":
      action.payload.token && ls.set('buzz-token', action.payload.token);
      return {...state, auth: {...state.auth, user: {...action.payload}}};

    case "SIGN_OUT_ATTEMPT":
      ls.remove('buzz-token');
      return {
        ...state,
        auth: {user: null},
        user: {age: 0, dateOfBirth: ""},
        entities: {}
      };

    case "SUBSCRIBE_TO_ENTITY":
      return handleSubscribeToEntity(state, action);

    case "ENTITY_LOADED":
    case "ENTITY_UPDATED":
      return entityUpdated(state, action);

    case "ENTITY_CREATED":
      return entityCreated(state, action);

    case "LEAD_CREATED":
      return leadCreated(state, action);

    case "LEAD_UPDATED":
      return leadUpdated(state, action);

    default:
      return state;
  }
}