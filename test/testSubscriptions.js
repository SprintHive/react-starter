#!/usr/bin/env node

const {Subject} = require('rxjs');

const uuid = require('../lib/uuid');
const createStore = require('../services/subscriptions/createStore');

const subscriptionTopicStream = new Subject();
const authTopicStream = new Subject();
const store = createStore({subscriptionTopicStream, authTopicStream});

const someUuid = uuid();
const subscribeAction = {
  type: "SUBSCRIBE_TO_ENTITY",
  payload: {
    entityKey: "lead",
    entityId: someUuid
  },
  meta: {
    socketId: 'Yh52tD7pos2Wg8s1AAAD'
  }
};

const unSubscribeAction = {
  type: "UNSUBSCRIBE_TO_ENTITY",
  payload: {
    entityKey: "lead",
    entityId: someUuid
  },
  meta: {
    socketId: 'Yh52tD7pos2Wg8s1AAAD'
  }
};

subscriptionTopicStream.next(subscribeAction);
let state = store.getState();
console.log("State after subscribe:\n", JSON.stringify(state, null, 2));
subscriptionTopicStream.next(unSubscribeAction);
state = store.getState();
console.log("State after unsubscribe\n:", JSON.stringify(state, null, 2));

