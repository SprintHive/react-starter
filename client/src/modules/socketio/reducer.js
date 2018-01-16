import {SOCKET_CONNECTION_STATUS_CHANGED_ACTION} from './actions';

const initialState = {status: "connecting"};

export default function (state = initialState, action) {
  switch (action.type) {
    case SOCKET_CONNECTION_STATUS_CHANGED_ACTION:
      console.log(SOCKET_CONNECTION_STATUS_CHANGED_ACTION, action.payload);
      return {...state, ...action.payload};

    default:
      return state;
  }
}
