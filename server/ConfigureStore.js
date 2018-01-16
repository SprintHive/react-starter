const {combineEpics, createEpicMiddleware} = require('redux-observable');
const {createStore, applyMiddleware, compose} = require('redux');
const {Subject, Observable} = require("rxjs");
const moment = require('moment');

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


const signIn = (action$) => {
  const loginAttempted = action$.ofType("LOGIN_ATTEMPTED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const socketId = action.meta.socketId;
      const user = action.payload;
      return Observable.of({type: "USER_LOGGED_IN", meta: {socketId, fromServer: true}, payload: {user}});
    });

  const usernameCaptured = action$.ofType("USERNAME_CAPTURED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const socketId = action.meta.socketId;
      const user = {userId: 1, name: "Jon", password: 'password', url: "/avatars/jll-avatar.png"};
      return Observable.of({type: "USER_LOGGED_IN", meta: {socketId, fromServer: true}, payload: {user}});
    });

  return Observable.merge(loginAttempted, usernameCaptured);
};

const dateOfBirthCaptured = (action$) => {
  return action$.ofType("DATE_OF_BIRTH_CAPTURED")
    .switchMap(action => {
      console.log(`Processing action ${action.type}`);
      const socketId = action.meta.socketId;
      const {dateOfBirth} = action.payload;
      const mDob = moment(dateOfBirth);
      const mNow = moment();
      const age = mNow.diff(mDob, 'years');
      return Observable.of({type: "AGE_CALCULATED", meta: {socketId, fromServer: true}, payload: {age}});
    })
};

const rootEpic = combineEpics(
  dispatchActionsToRedux,
  sendActionsFromServerToSockets,
  signIn,
  dateOfBirthCaptured
);

module.exports = (deps) => {
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

  const unsubscribe = store.subscribe(() => {
    // console.log(JSON.stringify(store.getState(), null, 2));
  });

  process.on('exit', () => {
    console.log("exiting the process");
    unsubscribe();
  });

  return store;
};