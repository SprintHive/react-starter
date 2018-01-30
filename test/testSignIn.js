const {Observable} = require("rxjs");

const signIn = require('../cqrs/signIn');

const state = {
  user: {
    1: {
      username: 'Jon',
      passwordHashed: '$2a$10$oWajO/F8xFFAO0bYuu539ejgaBoxR5Aq3BMm2aR9i1ILWl0KvSGje'
    }
  }
};

const testEvents = [
  {
    value: {
      type: "SIGN_IN_ATTEMPTED",
      entityKey: 'signIn',
      entityId: '1h6nSjZCnuaTnD3LAAAB',
      payload: {
        username: 'jon',
        password: 'password$123'
      }
    }
  }, {
    value: {
      type: "SIGN_IN_ATTEMPTED",
      entityKey: 'signIn',
      entityId: '1h6nSjZCnuaTnD3LAAAB',
      payload: {
        username: 'jon',
        password: 'password'
      }
    }
  }, {
    value: {
      type: "SIGN_IN_ATTEMPTED",
      entityKey: 'signIn',
      entityId: '1h6nSjZCnuaTnD3LAAAB',
      payload: {
        username: 'someNotFoundUser',
        password: 'password'
      }
    }
  }
];

const eventStream = Observable.from(testEvents);

const sendMessage = (message) => console.log(message);

signIn({state, eventStream, sendMessage});