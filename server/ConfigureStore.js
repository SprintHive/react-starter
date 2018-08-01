const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');
const {Subject, Observable} = require("rxjs");
const axios = require("axios");

const {relayConnectionActivityToAuthApi} = require('./epics/sockets');
const {listForRabbitMessages} = require('./epics/listenForRabbitMessages');

const reducer = require('./reducer');

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
      action.meta.socket = socket;
      subject.next(action);
    });
  });

  return subject;
};

const sendActionsFromServerToSockets = (action$, store, {io}) => {
  return action$.filter(action => action.meta && action.meta.fromServer)
    .switchMap(action => {
      const socketId = action.meta.socketId;
      delete action.meta.socket;
      console.log(`Sending action ${action.type} to socketId ${socketId}`);
      io.to(socketId).emit("actions", action);
      return Observable.empty();
    });
};

const subscribeToEntity = (action$, store, {io}) => {
  return action$.ofType("SUBSCRIBE_TO_ENTITY")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const {socket} = action.meta;
      const {entityKey, entityId} = action.payload;
      socket.join(`${entityKey}_${entityId}`);
      return Observable.empty();
    })
};

const unsubscribeFromEntity = (action$) => {
  return action$.ofType("UNSUBSCRIBE_FROM_ENTITY")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const {socket} = action.meta;
      const {entityKey, entityId} = action.payload;
      socket.leave(`${entityKey}_${entityId}`);
      return Observable.empty();
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
  createEntityAttempted,
  listForRabbitMessages,
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

  return createStore(reducer,
    compose(
      applyMiddleware(
        epicMiddleware
      )
    )
  );
};