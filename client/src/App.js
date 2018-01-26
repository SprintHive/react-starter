import React from 'react';
import {connect} from "react-redux";
import ConnectionStatus from './modules/socketio/ConnectionStatus'
import Example1 from "./modules/example1/Example1";
import {compose, withState} from "recompose";
import {nonOptimalStates} from "./hoc/nonOptimalStates";
import Logo from "./components/logo/Logo";
import TeamGalleryContainer from "./modules/login/TeamGalleryContainer";
import DisplayWhoIsLoggedIn from "./components/dispalyWhoIsLoggedIn/DisplayWhoIsLoggedIn";
import SignOut from "./modules/signout/SignOut";
import {withConnection} from "./hoc/withConnection";
import {withFadeIn} from "./hoc/withFadeIn";
import Radium from 'radium'

const mapStateToProps = (state) => {
  return {loggedInUser: state.auth.user}
};

const loginRequired = (props) => {
  return props.loggedInUser === null;
};

const PrivateApp = () => <Example1/>;

const enhanceLogin = compose(
  withFadeIn({delay: 1000}),
  Radium,
);

const showLogin = enhanceLogin(({fadeIn}) => {
  return (
    <div style={fadeIn}>
      <Logo/>
      <TeamGalleryContainer/>
      <ConnectionStatus/>
    </div>
  )
});

const withSplash = compose(
  withState("showSplash", "updateSplash", true)
);

const withLogin = compose(
  connect(mapStateToProps),
  withSplash,
  nonOptimalStates([
    {when: loginRequired, render: showLogin}
  ])
);

const connectedApp = compose(
  withConnection,
  withLogin
);

export default connectedApp(() =>
  <div>
    <DisplayWhoIsLoggedIn/>
    <SignOut/>
    <Logo/>
    <PrivateApp/>
    <ConnectionStatus/>
  </div>
);