import React from 'react'
import {compose, setDisplayName, withHandlers, withState} from 'recompose'
import FlexBox from '../FlexBox';
import {logProps} from "../../hoc/logProps";
import {connect} from "react-redux";
import {inputStyle} from "../Styles";

export const USERNAME_CAPTURED = "USERNAME_CAPTURED";
function usernameCaptured(username) {
  return {
    type: USERNAME_CAPTURED,
    meta: {remote: true},
    payload: {username}
  }
}

const enhance = compose(
  setDisplayName('LoginInput'),
  connect(null, {usernameCaptured}),
  withState('username', 'usernameChanged', ""),
  withHandlers({
    onKeyPress: ({usernameCaptured, username}) => e => {
      console.log('onKeyPress', e.keyCode);

      if (e.keyCode === 13) {
        console.log("enter clicked");
        usernameCaptured(username)
      }
    },
    onChange: ({usernameChanged}) => e => {
      console.log('onChange', e.target.value);
      usernameChanged(e.target.value);
    }
  }),
  logProps()
);

export const LoginInput = ({onKeyPress, onChange, onClick}) =>
  <FlexBox centered item>
    <input style={inputStyle}
           type="text"
           placeholder="username"
           onKeyUp={onKeyPress}
           onChange={onChange}
           autoFocus={true}

    />
  </FlexBox>;
    
export default enhance(LoginInput);