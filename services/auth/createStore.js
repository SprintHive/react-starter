const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');

const reducer = require('./reducer');
const {connectStreamsToRedux} = require('./epics/connectStreamsToRedux');
const processSignInAttempts = require('./epics/signIn');
const {forwardSuccessFulSignToBFF} = require('./epics/forwardSuccessFulSignToBFF');

const rootEpic = combineEpics(
  connectStreamsToRedux,
  processSignInAttempts,
  forwardSuccessFulSignToBFF,
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