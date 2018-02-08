const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');
const {Subject, Observable} = require("rxjs");
const axios = require("axios");

const {signIn, signOut} = require('./epics/auth');
const {relayConnectionActivityToAuthApi} = require('./epics/sockets');
const {printError} = require('../lib/axiosUtils');

const initialState = {socketMap: {}, userMap: {}, counter: 0};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const dispatchActionsToRedux = (action$, store, {io}) => {
  const subject = new Subject();

  io.on('connection', (socket) => {
    subject.next({
      type: "SOCKET_CONNECTED", payload: {
        socket: socket,
        socketId: socket.id
      }
    });

    socket.on("actions", action => {
      console.log("Received action", action.type);
      action.meta.socketId = socket.id;
      subject.next(action);
    });
  });

  return subject;
};

const sendActionsFromServerToSockets = (action$, store, {io}) => {
  return action$.filter(action => action.meta && action.meta.fromServer)
    .switchMap(action => {
      const socketId = action.meta.socketId;
      console.log(`Sending action ${action.type} to socketId ${socketId}`);
      io.to(socketId).emit("actions", action);
      return Observable.empty();
    });
};

const subscribeToEntity = (action$) => {
  return action$.ofType("SUBSCRIBE_TO_ENTITY")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);

      let endpoint = `http://localhost:3007/subscriptions/v1/fact/SUBSCRIBE_TO_ENTITY`;
      console.log("Subscribing to entity", endpoint);
      axios.post(endpoint, action)
        .then(ans => console.log(ans.data))
        .catch(e => {
          printError({e, message: "Something went wrong subscribing to an entity"})
        });

      return Observable.empty();
    })
};

const unsubscribeFromEntity = (action$) => {
  return action$.ofType("UNSUBSCRIBE_FROM_ENTITY")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const {entityKey} = action.payload;

      let endpoint = `http://localhost:3007/subscriptions/v1/fact/UNSUBSCRIBE_FROM_ENTITY`;

      axios.post(endpoint, action).then(ans => console.log(ans.data)).catch(err => {
        if (err.response) {
          const {status, data} = err.response;
          console.error("Something went wrong un-subscribing to an entity", status, data)
        } else {
          console.error("Something went wrong un-subscribing to an entity", entityKey)
        }
      });

      return Observable.empty();
    })
};

const dateOfBirthCaptured = (action$) => {
  return action$.ofType("DATE_OF_BIRTH_CAPTURED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      return Observable.fromPromise(
        axios.post(`http://localhost:3008/entity/write/v1/fact`, action))
        .mergeMap(() => Observable.empty());
    })
};

const createEntityAttempted = (action$) => {
  return action$.ofType("CREATE_ENTITY_ATTEMPTED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      return Observable.fromPromise(
        axios.post(`http://localhost:3008/entity/create/v1/fact`, action))
        .mergeMap(() => Observable.empty());
    })
};

const rootEpic = combineEpics(
  dispatchActionsToRedux,
  sendActionsFromServerToSockets,
  signIn,
  signOut,
  dateOfBirthCaptured,
  subscribeToEntity,
  unsubscribeFromEntity,
  createEntityAttempted
);

module.exports = (deps) => {
  relayConnectionActivityToAuthApi(deps);

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