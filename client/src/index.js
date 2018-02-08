import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom'
import io from 'socket.io-client';
import {StyleRoot} from 'radium';

import './index.css';
import App from './App';
import {configureStore} from "./configureStore";
import registerServiceWorker from './registerServiceWorker';

const deps = {socket: io()};
const store = configureStore(deps);

ReactDOM.render(
  <StyleRoot>
    <Provider store={store}>
      <Router>
        <App/>
      </Router>
    </Provider>
  </StyleRoot>
  ,
  document.getElementById('root'));

registerServiceWorker();
