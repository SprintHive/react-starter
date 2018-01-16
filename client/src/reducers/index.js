import {combineReducers} from 'redux'

import user from '../components/dateOfBirthInput/DateOfBirthReducer';
import connection from '../modules/socketio/reducer';
import auth from '../modules/auth/AuthReducer';

export default combineReducers({
  connection,
  user,
  auth
});