
const initialState = {
  connection: {status: "connecting", timeConnected: undefined},
  auth: {user: null},
  user: {age: 0, dateOfBirth: "", dateOfBirthInput: ""},
  teamGallery: {loading: false, userList: null},
  entities: {}
};

function handleSubscribeToEntity(state, action) {
  const ans = {...state};
  const entities = {...state.entities};
  const {entityKey, entityId} = action.payload;
  const key = `${entityKey}_${entityId}`;
  let found = entities[key];
  if (found) {
    entities[key] = {...found, ...{loading: true}}
  } else {
    entities[key] = {...{loading: true}}
  }
  ans.entities = entities;
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
      const entities = {...state.entities};
      const {entityKey, entityId} = action.source.action;
      const key = `${entityKey}_${entityId}`;
      let found = entities[key];

      if (found) {
        entities[key] = {...found, ...action.payload}
      } else {
        entities[key] = {...action.payload}
      }

      entities[key].loading = false;
      ans.entities = entities;
      return ans;

    default:
      return state;
  }
}