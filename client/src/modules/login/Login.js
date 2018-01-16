import React from 'react'
import {compose, setDisplayName, withHandlers} from 'recompose'
import LoginInput from "../../components/loginInput/LoginInput";

const enhance = compose(
  setDisplayName('Login'),
  withHandlers({
    done: props => (username) => {
      console.log("done", username);
    }
  })
);

export const Login = (props) => <LoginInput {...props}/>;

export default enhance(Login);