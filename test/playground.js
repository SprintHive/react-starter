#!/usr/bin/env node

/*
const {Subject} = require('rxjs');

const createStore = require('../services/subscriptions/createStore');

const subscriptionStream = new Subject();
const store = createStore({subscriptionStream});

const state = store.getState();
console.log("State:", JSON.stringify(state, null, 2));

*/

const testConsumer = () => {
  console.log('testConsumer');
  const createConsumer = require('../lib/createConsumer');
    const eventStream = createConsumer({
      consumerConfig: {replay: true},
      streamOptions: {topics: 'test-stream'}
    });
  // const eventStream = createConsumer();
  eventStream.subscribe(console.log);
};

testConsumer();

