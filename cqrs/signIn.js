const bcrypt = require('bcrypt');
const {Observable} = require('rxjs');

const compare = Observable.bindNodeCallback(bcrypt.compare);

const lookupUserByName = ({state, username}) => {
  const userArray = Object.keys(state.user)
    .map(key => state.user[key])
    .filter(user => user.name.toLowerCase() === username.toLowerCase());

  return userArray.length > 0 ? userArray[0] : undefined;
};

module.exports = ({state, eventStream, sendMessage}) => {
  const lookupTheUsers = eventStream
    .filter(({value}) => value.type === "SIGN_IN_ATTEMPTED")
    .filter(message => message.value.payload)
    .do(console.log)
    .map(message => {
      message.value.userFromDB = lookupUserByName({state, username: message.value.payload.username});
      return message;
    });

  const partition = lookupTheUsers.partition(message => message.value.userFromDB);
  const userFound = partition[0];
  const userNotFound = partition[1];

  userFound
    .mergeMap(message => compare(message.value.payload.password, message.value.userFromDB.passwordHashed)
      .do((matched) => message.value.result = {matched})
      .map(() => message))
    .subscribe(message => {
      console.info("signIn: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload, result, userFromDB} = message.value;

      const source = {
        service: {name: "sign-in"},
        action: {entityKey, entityId, type, payload}
      };

      result.matched
        ? sendMessage({type: "SIGN_IN_SUCCESSFUL", payload: userFromDB, source})
        : sendMessage({type: "SIGN_IN_REJECTED", payload: {message: "Invalid Credentials"}, source});
    });

  userNotFound
    .subscribe(message => {
      console.info("signIn: Received a message from the event stream", message);
      const {entityKey, entityId, type, payload} = message.value;

      const source = {
        service: {name: "sign-in"},
        action: {entityKey, entityId, type, payload}
      };

      sendMessage({type: "SIGN_IN_REJECTED", payload: {message: "User not found"}, source});
    });
};