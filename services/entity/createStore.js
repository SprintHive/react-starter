const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');

const reducer = require('./reducer');
const {connectStreamsToRedux} = require('./epics/connectStreamsToRedux');
const calculateAge = require('./epics/calculateAge');

const rootEpic = combineEpics(
  connectStreamsToRedux,
  calculateAge
);

module.exports = (deps) => {

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      ...deps
    }
  });

  return createStore(reducer,
    compose(
      applyMiddleware(
        epicMiddleware
      )
    )
  );
};