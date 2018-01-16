import React from 'react'
import {compose, setDisplayName, withHandlers, withState} from 'recompose'
import {inputStyle} from "../Styles";
import FlexBox from "../FlexBox";

const enhance = compose(
  setDisplayName('PasswordInput'),
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

export const PasswordInput = (props) => {
  return (
    <FlexBox centered item>
      <input style={inputStyle}
             type="text"
             placeholder="username"
             onKeyUp={onKeyPress}
             onChange={onChange}
             autoFocus={true}

      />
    </FlexBox>
  )
};

export default enhance(PasswordInput);