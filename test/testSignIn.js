const {Subject} = require("rxjs");
const test = require('tape');
const createStore = require('../services/auth/createStore');

const socketConnected = {"type":"SOCKET_CONNECTED","payload":{"socketId":"Yh52tD7pos2Wg8s1AAAD"}};
const socketDisconnected = {"type":"SOCKET_DISCONNECTED","payload":{"socketId":"Yh52tD7pos2Wg8s1AAAD"}};

const signInWithToken = {
  type: "SIGN_IN_ATTEMPTED",
  payload: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGFsZSIsImF2YXRhclVybCI6Ii9hdmF0YXJzL0RULUF2YXRhci5wbmciLCJpYXQiOjE1MTc3NjMzNzAsImV4cCI6MTUxODk3Mjk3MH0.3mMJgwLLIbadN-SEMK7ljAE6N2LW9NfVNqjNfuJGR0w",
  },
  meta: {
    socketId: "Yh52tD7pos2Wg8s1AAAD",
    offset: 0
  }
};

const signInWithCredentials = {
  type: "SIGN_IN_ATTEMPTED",
  payload: {
    user: {
      name: "Dale",
      userId: 1,
      avatarUrl: "/avatars/DT-Avatar.png",
      passwordHashed: "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje",
      password: "password$123"
    }
  },
  meta: {
    socketId: "Yh52tD7pos2Wg8s1AAAD",
    offset: 1
  }
};

const entityActions = [
  {"type": "NAME_CAPTURED", "entityKey": "user", "entityId": 1, "payload": {"name": "Dale"}},
  {
    "type": "AVATAR_URL_CAPTURED",
    "entityKey": "user",
    "entityId": 1,
    "payload": {"avatarUrl": "/avatars/DT-Avatar.png"}
  },
  {
    "type": "PASSWORD_CAPTURED",
    "entityKey": "user",
    "entityId": 1,
    "payload": {"passwordHashed": "$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje"}
  }
];

const authTopicStream = new Subject();
const entityTopicStream = new Subject();

test('a user that a user can sign in', function (t) {
  t.plan(1);

  const sendMessage = (message) => {
    console.log(JSON.stringify(message, null, 2));
    t.equal('SIGN_IN_SUCCESSFUL', message.type, "Got a successful sign in");
    message.meta = {offset: 3};
    authTopicStream.next(message);
  };

  const store = createStore({authTopicStream, entityTopicStream, sendMessage, offset: -1});
  entityActions.forEach(a => entityTopicStream.next(a));
  authTopicStream.next(socketConnected);
  authTopicStream.next(signInWithCredentials);
  // authTopicStream.next(signInWithToken);

  setTimeout(function() {
    console.log("render", JSON.stringify(store.getState(), null, 2));
  }, 4000);
});


