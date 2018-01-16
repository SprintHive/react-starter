
import {SIGN_OUT_ATTEMPT} from "../signout/SignOut";

const initialState = {user: null};

export default function (state = initialState, action) {
  switch (action.type) {
    case "USER_LOGGED_IN":
      return {...state, ...action.payload};

    case SIGN_OUT_ATTEMPT:
      const ans = Object.assign({}, state);
      ans.user = null;
      return ans;

    default:
      return state;
  }
}
