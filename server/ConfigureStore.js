const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');
const {Subject, Observable} = require("rxjs");
const axios = require("axios");

const {signIn, signOut} = require('./epics/auth');
const {relayConnectionActivityToAuthApi} = require('./epics/sockets');
const {printError} = require('../lib/axiosUtils');

const SOCKET_CONNECTED = "SOCKET_CONNECTED";

const initialState = {socketMap: {}, userMap: {}, counter: 0};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INC":
      return {...state, ...{counter: state.counter + 1}};

    case SOCKET_CONNECTED:
      const socketId = action.payload.socketId;
      const ans = {...state};
      ans.socketMap[socketId] = {socketId, connectedTime: Date.now(), userId: undefined};
      return {...state};

    default:
      return state;
  }
};

const dispatchActionsToRedux = (action$, store, {io}) => {
  const subject = new Subject();

  io.on('connection', (socket) => {
    subject.next({
      type: SOCKET_CONNECTED, payload: {
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
      // const socketId = action.meta.socketId;
      // const {entityKey, entityId} = action.payload;
      // const params = {socketId, payload: {entityKey, entityId}};

      let endpoint = `http://localhost:3007/subscriptions/v1/fact/SUBSCRIBE_TO_ENTITY`;
      console.log("Subscribing to entity", endpoint);
      axios.post(endpoint, action)
        .then(ans => console.log(ans.data))
        .catch(e => {
          printError({e, message: "Something went wrong subscribing to an entity"})
        });

      return Observable.empty()
/*
      return Observable.fromPromise(axios.post(endpoint, params))
        .map(({data}) => ({
          type: "ENTITY_LOADED",
          meta: {socketId, fromServer: true},
          payload: data,
          source: {
            service: "BFF",
            action: {entityKey, entityId}
          }
        }))
        .catch(e => {
          printError({e, message: "Something went wrong when trying to load an entity"})
          return Observable.empty()
        })
*/
    })
};

const unsubscribeFromEntity = (action$) => {
  return action$.ofType("UNSUBSCRIBE_FROM_ENTITY")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      // const socketId = action.meta.socketId;
      const {entityKey} = action.payload;
      // const params = {socketId, payload: {entityKey, entityId}};

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

const rootEpic = combineEpics(
  dispatchActionsToRedux,
  sendActionsFromServerToSockets,
  signIn,
  signOut,
  dateOfBirthCaptured,
  subscribeToEntity,
  unsubscribeFromEntity
);

module.exports = (deps) => {
  relayConnectionActivityToAuthApi(deps);

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {
      ...deps
    }
  });

  const store = createStore(reducer,
    compose(
      applyMiddleware(
        epicMiddleware
      )
    )
  );

  /*
    const unsubscribe = store.subscribe(() => {
      console.log(JSON.stringify(store.getState(), null, 2));
    });
  */

  /*
    process.on('exit', () => {
      console.log("exiting the process");
      unsubscribe();
    });
  */

  return store;
};