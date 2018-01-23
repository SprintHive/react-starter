import {createStore, applyMiddleware, compose} from 'redux';
import {createEpicMiddleware} from 'redux-observable';

import {rootEpic} from './epics/index';
import reducers from './reducers';

export function configureStore(deps) {
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      ...deps
    }
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return createStore(reducers,
    composeEnhancers(
      applyMiddleware(
        epicMiddleware
      )
    )
  )
}