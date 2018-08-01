const {Observable} = require('rxjs');
const axios = require('axios');

const signIn = (action$, store, deps) => {
  return action$.ofType("SIGN_IN_ATTEMPTED")
    .mergeMap(action => {
      console.log(`Processing action ${action.type} ${JSON.stringify(action.payload, null, 2)}`);
      const {userId, name, avatarUrl} = action.payload.user;
      return Observable.of({type: "SIGN_IN_SUCCESSFUL", payload: {userId, name, avatarUrl}});
    });
};

const signOut = (action$) => {
  return action$.ofType("SIGN_OUT_ATTEMPT")
    .mergeMap(action => {
      console.log(`Processing action ${action.type} ${JSON.stringify(action.payload, null, 2)}`);
      const socketId = action.meta.socketId;
      const params = {socketId};
      return Observable.fromPromise(axios.post(`http://localhost:3009/auth/v1/signout`, params))
        .map(({data}) => ({
          type: "SIGN_OUT_SUCCESS",
          meta: {
            socketId,
            fromServer: true
          },
          payload: null
        }));
    });
};

module.exports = {signIn, signOut};