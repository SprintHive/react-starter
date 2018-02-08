import ls from 'local-storage';

const initialState = {
  connection: {status: "connecting", timeConnected: undefined},
  auth: {user: null},
  loading: {},
  entities: {}
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
  const {entityKey, entityId} = action;

  // ensure that the entityKey is in the entities object
  if (!ans.entities[entityKey]) ans.entities[entityKey] = {};

  let found = ans.entities[entityKey][entityId];
  if (!found) ans.entities[entityKey][entityId] = action.payload || {};
  return ans;
}

export default (state = initialState, action) => {
  switch (action.type) {

    case "SOCKET_CONNECTION_STATUS_CHANGED_ACTION":
      const {status, socketId} = action.payload;
      const connection = {status, socketId};
      if (status === 'Connected') connection.timeConnected = Date.now();
      return {...state, connection};

    case "USER_LOGGED_IN":
    case "VALIDATE_TOKEN_SUCCESSFUL":
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

    case "DATE_OF_BIRTH_CAPTURED":
      // we could update our state optimistically here and then the subscription manager does not need to send the
      // entity updated event to this connected client, this is an optimisation for future Jon
      console.log(action);
      return state;

    case "ENTITY_CREATED":
      return entityCreated(state, action);

    case "ENTITY_LOADED":
    case "ENTITY_UPDATED":
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

      const key = calcKey(entityKey, entityId);
      loading[key] = false;
      ans.loading = loading;
      ans.entities = entities;
      return ans;

    default:
      return state;
  }
}