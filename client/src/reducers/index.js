
const initialState = {
  connection: {status: "connecting", timeConnected: undefined},
  auth: {user: null},
  user: {age: 0, dateOfBirth: "", dateOfBirthInput: ""},
  teamGallery: {loading: false, userList: null},
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


export default (state = initialState, action) => {
  switch (action.type) {

    case "TEAM_GALLERY_WILL_MOUNT":
      return {...state, teamGallery: {loading: true}};

    case "TEAM_GALLERY_LOADED":
      return {...state, teamGallery: {loading: false, userList: action.payload}};

    case "SOCKET_CONNECTION_STATUS_CHANGED_ACTION":
      const {status} = action.payload;
      const connection = {status};
      if (status === 'Connected') connection.timeConnected = Date.now();
      return {...state, connection};

    case "USER_LOGGED_IN":
      return {...state, auth: {...state.auth, ...action.payload}};

    case "DATE_OF_BIRTH_UPDATED":
    case "DATE_OF_BIRTH_CAPTURED":
    case "AGE_CALCULATED":
      return {...state, user: {...state.user, ...action.payload}};
    
    case "SIGN_OUT_ATTEMPT":
      return {...state,
        auth: {user: null},
        user: {age: 0, dateOfBirth: ""},
        entities: {}
      };

    case "SUBSCRIBE_TO_ENTITY":
      return handleSubscribeToEntity(state, action);

    case "ENTITY_LOADED":
    case "ENTITY_UPDATED":
      const ans = {...state};
      const loading = {...state.loading};
      const entities = {...state.entities};
      const {entityKey, entityId} = action.source.action;

      if (entityId) {
        let found = entities[entityKey][entityId];
        console.log(found);
        if (found) {
          entities[entityKey][entityId] = {...found, ...action.payload}
        } else {
          entities[entityKey][entityId] = {...action.payload}
        }
      } else {
        let found = entities[entityKey];
        if (found) {
          entities[entityKey] = {...found, ...action.payload}
        } else {
          entities[entityKey] = {...action.payload}
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