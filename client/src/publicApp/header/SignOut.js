import React from 'react';
import {connect} from "react-redux";
import {compose, renderNothing, setDisplayName, withHandlers} from 'recompose';
import {nonOptimalStates} from "../../hoc/nonOptimalStates";
import Button from "../../components/button/Button";
import {withLoggedInUser} from "../../hoc/withLoggedInUser";

export const SIGN_OUT_ATTEMPT = "SIGN_OUT_ATTEMPT";
const signOut = () => ({type: SIGN_OUT_ATTEMPT, meta: {remote: true}});

const mapStateToProps = (state) => {
  return {loggedInUser: state.auth.user}
};

const noOneIsLoggedIn = ({loggedInUser}) => !loggedInUser;

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

const enhance = compose(
  setDisplayName('SignOut'),
  withLoggedInUser,
  connect(mapStateToProps, {signOut}),
  nonOptimalStates([
    {when: noOneIsLoggedIn, render: renderNothing()}
  ]),
  withHandlers({
    onClick: ({signOut}) => e => {
      signOut();
    }
  })
);

export const SignOut = (props) => {
  return (
    <Button style={style.container} onClick={props.onClick}>SignOut</Button>
  )
};

export default enhance(SignOut);