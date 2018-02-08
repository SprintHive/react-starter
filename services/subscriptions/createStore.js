const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');

const reducer = require('./reducer');
const {connectStreamsToRedux} = require('./epics/connectStreamsToRedux');
const {forwardEntityUpdatesToSubscribers} = require('./epics/forwardEntityUpdatesToSubscribers');
const {loadEntityForInitialSubscribers} = require('./epics/loadEntityForInitialSubscribers');
const {forwardEntityCreatedToSubscriber} = require('./epics/forwardEntityCreatedToSubscriber');

const rootEpic = combineEpics(
  connectStreamsToRedux,
  forwardEntityUpdatesToSubscribers,
  loadEntityForInitialSubscribers,
  forwardEntityCreatedToSubscriber
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