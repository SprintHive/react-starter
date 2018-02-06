require('dotenv').config();
const moment = require('moment');

const createProducer = require('../../lib/createProducer');
const {sendMessage} = createProducer({streamOptions: {topic: process.env.subscriptionTopic}});

const createConsumer = require('../../lib/createConsumer');
const entityTopicStream = createConsumer({
  consumerConfig: {replay: true},
  streamOptions: {
    topics: process.env.entityTopic
  }
});

const state = {};

const {manageOffset, readOffset} = require('../../lib/writeStateToDisk');
const offset = readOffset(__dirname);
console.log('offset:', offset);
manageOffset(entityTopicStream, __dirname);

entityTopicStream
  .filter(action => action.type === "DATE_OF_BIRTH_CAPTURED")
  .subscribe(action => {
    console.info("calculate-age: Received a action from the event stream", action);
    const {entityKey, entityId, type, payload, meta} = action;

    if (!state[entityKey]) state[entityKey] = {};
    let found = state[entityKey][entityId];
    const {dateOfBirth} = payload;
    const mDob = moment(dateOfBirth);
    const mNow = moment();
    const age = mNow.diff(mDob, 'years');

    if (found) {
      found.age = age
    } else {
      state[entityKey][entityId] = {age, userId: entityId};
    }

    const source = {
      service: {name: "calculate-age"},
      action: {entityKey, entityId, type}
    };

    if (meta.offset > offset) {
      sendMessage({type: "AGE_CALCULATED", entityKey, entityId, payload: {age}, source});
    } else {
      console.log(`calculate-age: skipping ${action.type} due to offset ${meta.offset} > ${offset} ${type}`);
    }
  });