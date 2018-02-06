const bcrypt = require('bcrypt');
const {Observable, Subject} = require('rxjs');
const {sign, verifyToken} = require('../../../lib/jwsTokenUtils');
const filterOffset = require('../../../lib/filterOffset');

const compare = Observable.bindNodeCallback(bcrypt.compare);

const lookupUserByName = ({state, username}) => {
  const userArray = Object.keys(state.user)
    .map(key => state.user[key])
    .filter(user => user.name.toLowerCase() === username.toLowerCase());

  return userArray.length > 0 ? userArray[0] : undefined;
};

const signUserInWithCredentials = (action, store, deps) => {
  const subject = new Subject();

  const partition = Observable.of(action)
    .filter(action => {
      return filterOffset(action.meta.offset, deps.offset);
    })
    .map(action => {
      const state = store.getState();
      const userFromDB = lookupUserByName({state, username: action.payload.user.name});
      return {userFromDB, action};
    })
    .partition(state => state.userFromDB && state.userFromDB.passwordHashed);

  const userFound = partition[0];
  const userNotFound = partition[1];

  userFound
    .mergeMap(state => {
      const password = state.action.payload.user.password;
      return compare(password, state.userFromDB.passwordHashed)
        .do((matched) => state.result = {matched})
        .map(() => state)
    })
    .subscribe(state => {
      const {action, result, userFromDB} = state;
      const {userId, name, avatarUrl} = userFromDB;
      const token = sign({userId, name, avatarUrl});
      const source = {service: {name: "sign-in"}, action};

      const ans = result.matched
        ? {type: "SIGN_IN_SUCCESSFUL", payload: {userId, name, avatarUrl, token}, source}
        : {type: "SIGN_IN_REJECTED", payload: {message: "Invalid Credentials"}, source};
      subject.next(ans);
    });

  userNotFound
    .subscribe(state => {
      const {action} = state;
      const source = {service: {name: "sign-in"}, action};

      subject.next({type: "SIGN_IN_REJECTED", payload: {message: "User not found"}, source})
    });

  return subject;
};

const signUserInWithToken = (action) => {
  const token = action.payload.token;
  return verifyToken(token)
    .map(user => {
      const {userId, name, avatarUrl} = user;
      const source = {service: {name: "sign-in"}, action};
      return {type: "SIGN_IN_SUCCESSFUL", payload: {userId, name, avatarUrl, token}, source}
    })
};

const processSignInAttempts = (action$, store, deps) => {
  const {sendMessage} = deps;
  const signInAttemptedStream = action$.ofType("SIGN_IN_ATTEMPTED")
    .filter(action => {
      return filterOffset(action.meta.offset, deps.offset);
    });

  const cred = signInAttemptedStream
    .filter(action => action.payload.user)
    .mergeMap(action => signUserInWithCredentials(action, store, deps));

  const token = signInAttemptedStream
    .filter(action => action.payload.token)
    .mergeMap(signUserInWithToken);

  return Observable.merge(cred, token)
    .do(sendMessage)
    .mergeMap(() => Observable.empty())
    .catch(() => Observable.empty());
};

module.exports = processSignInAttempts;