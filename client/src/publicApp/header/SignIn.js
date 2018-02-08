import React from 'react'
import {compose, setDisplayName, withHandlers, renderNothing} from 'recompose'
import Button from "../../components/button/Button";
import {withRouter} from 'react-router-dom';
import {withLoggedInUser} from "../../hoc/withLoggedInUser";
import {nonOptimalStates} from "../../hoc/nonOptimalStates";

const style = {
  container: {
    position: 'fixed',
    top: 10,
    right: 10,
    width: 100,
    height: 30,
    cursor: 'pointer'
  }
};

const someOneIsLoggedIn = (props) => props.loggedInUser;
// const renderSignOut = () => <SignOut/>;

const enhance = compose(
  setDisplayName('SignIn'),
  withRouter,
  withLoggedInUser,
  withHandlers({
    onClick: props => e => {
      props.history.push('/signin')
    }
  }),
  nonOptimalStates([
    {when: someOneIsLoggedIn, render: renderNothing()}
  ])
);

export const SignIn = (props) => {
  return (
    <Button style={style.container} onClick={props.onClick}>Sign In</Button>
  )
};

export default enhance(SignIn);