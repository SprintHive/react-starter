import React from 'react';
import {connect} from "react-redux";
import {Route, Link, withRouter} from 'react-router-dom';

import PublicApp from './publicApp/PublicApp';
import ConnectionStatus from './modules/socketio/ConnectionStatus';
import Example1 from "./modules/example1/Example1";
import Example2 from "./modules/example2/Example2";
import {compose, withState} from "recompose";
import PrivateApp from './privateApp/PrivateApp';
import {nonOptimalStates} from "./hoc/nonOptimalStates";
import Logo from "./components/logo/Logo";
import TeamGalleryContainer from "./modules/signin/TeamGalleryContainer";
import DisplayWhoIsLoggedIn from "./components/dispalyWhoIsLoggedIn/DisplayWhoIsLoggedIn";
import SignOut from "./publicApp/header/SignOut";
import {withSplash} from "./hoc/withSplash";
import {withFadeIn} from "./hoc/withFadeIn";
import Radium from 'radium';
import SignIn from "./publicApp/header/SignIn";
import SignInContainer from "./modules/signin/SignInContainer";

const mapStateToProps = (state) => {
  return {loggedInUser: state.auth.user}
};

const loginRequired = (props) => {
  return props.loggedInUser === null;
};

// const PrivateApp = () => <Example2/>;

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

/*
const withSplash = compose(
  withState("showSplash", "updateSplash", true)
);
*/

const withLogin = compose(
  connect(mapStateToProps),
  // withSplash,
  nonOptimalStates([
    {when: loginRequired, render: showLogin}
  ])
);

const connectedApp = compose(
  withSplash,
  withLogin
);

/*
export default connectedApp(() =>
  <div>
    <Link to="/example1">Example 1</Link>
    <Link to="/example2">Example 2</Link>

    <DisplayWhoIsLoggedIn/>
    <SignOut/>
    <Logo/>
    <PrivateApp/>
    <ConnectionStatus/>
  </div>
);
*/

const Test1 = () => <h1>test 1</h1>;
const Test2 = () => <h1>test 2</h1>;

const enhanceApp = compose(
  withRouter,
  withSplash,
  withFadeIn(),
  Radium
);

/*
const App = enhanceApp(({fadeIn}) =>
  <div style={fadeIn}>
    <Link to="/">HOME</Link>

    <Route exact path="/" component={Test1}/>
    <Route exact path="/signin" component={Test2}/>
    <Route exact path="/example1" component={PublicApp}/>
    <Route exact path="/example2" component={PublicApp}/>

    <Route exact path="/" component={ConnectionStatus}/>
  </div>);
*/
const App = enhanceApp(() => {
  return (
    <div>
      <Logo/>
      <DisplayWhoIsLoggedIn/>
      <SignIn/>
      <SignOut/>
      <Link to="/">home</Link>
      <Link to="/test2">test 2</Link>
      <Link to="/example1">example 1</Link>
      <Link to="/example2">example 2</Link>
      <Route exact path="/" component={PublicApp}/>
      <Route exact path="/" component={PrivateApp}/>
      <Route exact path="/test2" component={Test2}/>
      <Route exact path="/example1" component={Example1}/>
      <Route exact path="/example2" component={Example2}/>
      <Route exact path="/signin" component={SignInContainer}/>
      <ConnectionStatus/>
    </div>
  )
});
export default App;
