
const initialState = {
  connection: {status: "connecting"},
  auth: {user: null},
  user: {age: 0, dateOfBirth: "", dateOfBirthInput: ""},
  teamGallery: {loading: false, userList: null}
};

export default (state = initialState, action) => {
  switch (action.type) {

    case "TEAM_GALLERY_WILL_MOUNT":
      return {...state, teamGallery: {loading: true}};

    case "TEAM_GALLERY_LOADED":
      return {...state, teamGallery: {loading: false, userList: action.payload}};

    case "SOCKET_CONNECTION_STATUS_CHANGED_ACTION":
      return {...state, connection: {...action.payload}};

    case "USER_LOGGED_IN":
      return {...state, auth: {...state.auth, ...action.payload}};

    case "DATE_OF_BIRTH_UPDATED":
    case "DATE_OF_BIRTH_CAPTURED":
    case "AGE_CALCULATED":
      return {...state, user: {...state.user, ...action.payload}};
    
    case "SIGN_OUT_ATTEMPT":
      return {...state,
        auth: {user: null},
        user: {age: 0, dateOfBirth: ""}
      };

    default:
      return state;
  }
}