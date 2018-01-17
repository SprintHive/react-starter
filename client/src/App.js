import React from 'react';
import {StyleRoot} from 'radium';
import {connect} from "react-redux";
import ConnectionStatus from './modules/socketio/ConnectionStatus'
import Example2 from "./modules/example1/Example1";
import Login from "./modules/login/Login";
import {compose, withState} from "recompose";
import {nonOptimalStates} from "./hoc/nonOptimalStates";
import Logo from "./components/logo/Logo";
import TeamGallery from "./components/teamGallery/TeamGallery";
import DisplayWhoIsLoggedIn from "./components/dispalyWhoIsLoggedIn/DisplayWhoIsLoggedIn";
import SignOut from "./modules/signout/SignOut";
import Splash from "./modules/splash/Splash";

const mapStateToProps = (state) => {
  return {loggedInUser: state.auth.user}
};

const loginRequired = (props) => {
  return props.loggedInUser === null;
};

const PrivateApp = () => <Example2/>;

// const showLogin = () => <Login/>;
// const showLogin = () => <TeamGallery/>;
const showLogin = () =>
  <div>
    <Login/>
    <TeamGallery/>
  </div>;

const theSplashScreen = (props) => <Splash updateSplash={props.updateSplash}/>;

const withSplash = compose(
  withState("showSplash", "updateSplash", true)
);

const weNeedToShowSplashScreen = ({showSplash}) => {
  return showSplash;
};

const enhance = compose(
  connect(mapStateToProps),
  withSplash,
  nonOptimalStates([
    // {when: weNeedToShowSplashScreen, render: theSplashScreen},
    {when: loginRequired, render: showLogin}
  ])
);

const Content = enhance(PrivateApp);

const Shell = () =>
  <StyleRoot>
    <DisplayWhoIsLoggedIn/>
    <SignOut/>
    <Logo/>
    <Content/>
    <ConnectionStatus/>
  </StyleRoot>;

export default Shell;