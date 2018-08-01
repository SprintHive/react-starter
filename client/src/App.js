import React from 'react';
import {Link, Route, withRouter} from 'react-router-dom';

import PublicApp from './publicApp/PublicApp';
import ConnectionStatus from './modules/socketio/ConnectionStatus';
import Example1 from "./modules/example1/Example1";
import {compose} from "recompose";
import PrivateApp from './privateApp/PrivateApp';
import Logo from "./components/logo/Logo";
import DisplayWhoIsLoggedIn from "./components/dispalyWhoIsLoggedIn/DisplayWhoIsLoggedIn";
import SignOut from "./publicApp/header/SignOut";
import {withSplash} from "./hoc/withSplash";
import {withFadeIn} from "./hoc/withFadeIn";
import Radium from 'radium';
import SignIn from "./publicApp/header/SignIn";
import SignInContainer from "./modules/signin/SignInContainer";
import Example2 from "./modules/example2/Example2";

const enhanceApp = compose(
  withRouter,
  withSplash,
  withFadeIn(),
  Radium
);

const App = enhanceApp(() => {
  return (
    <div>
      <Logo/>
      <DisplayWhoIsLoggedIn/>
      <SignIn/>
      <SignOut/>
      <Link to="/">home</Link>
      <Link to="/example1">example 1</Link>
      <Link to="/example2">example 2</Link>
      <Route exact path="/" component={PublicApp}/>
      <Route exact path="/" component={PrivateApp}/>
      <Route exact path="/example1" component={Example1}/>
      <Route exact path="/example2" component={Example2}/>
      <Route exact path="/signin" component={SignInContainer}/>
      <ConnectionStatus/>
    </div>
  )
});
export default App;
